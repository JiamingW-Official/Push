// Push — Unified Sidebar icon set
// Powered by Lucide React — consistent 22×22 stroke 1.75 across all roles.
// All icons inherit currentColor so the sidebar hover state controls colour.

import {
  Home,
  Briefcase,
  Compass,
  TrendingUp,
  BarChart3,
  Inbox,
  Trophy,
  Bell,
  Settings,
  Users,
  Megaphone,
  UserCheck,
  QrCode,
  Gift,
  MapPin,
  CreditCard,
  Receipt,
  Shield,
  Scale,
  Lock,
  Sparkles,
  ClipboardList,
  CircleDollarSign,
  User,
  Wallet,
  MessageCircle,
  type LucideProps,
} from "lucide-react";
import type { ReactNode } from "react";

export type IconKey =
  | "home"
  | "campaigns"
  | "users"
  | "applicants"
  | "analytics"
  | "discover"
  | "work"
  | "earnings"
  | "wallet"
  | "inbox"
  | "messages"
  | "trophy"
  | "qr"
  | "redeem"
  | "location"
  | "payments"
  | "billing"
  | "shield"
  | "scale"
  | "lock"
  | "sparkle"
  | "audit"
  | "finance"
  | "settings"
  | "bell"
  | "user"
  | "cohorts";

const ICON_PROPS: LucideProps = {
  size: 22,
  strokeWidth: 1.75,
  absoluteStrokeWidth: false,
};

const MAP: Record<IconKey, (props: LucideProps) => ReactNode> = {
  home: (p) => <Home {...p} />,
  work: (p) => <Briefcase {...p} />,
  discover: (p) => <Compass {...p} />,
  earnings: (p) => <TrendingUp {...p} />,
  analytics: (p) => <BarChart3 {...p} />,
  inbox: (p) => <Inbox {...p} />,
  trophy: (p) => <Trophy {...p} />,
  bell: (p) => <Bell {...p} />,
  settings: (p) => <Settings {...p} />,
  users: (p) => <Users {...p} />,
  cohorts: (p) => <Users {...p} />,
  campaigns: (p) => <Megaphone {...p} />,
  applicants: (p) => <UserCheck {...p} />,
  qr: (p) => <QrCode {...p} />,
  redeem: (p) => <Gift {...p} />,
  location: (p) => <MapPin {...p} />,
  payments: (p) => <CreditCard {...p} />,
  billing: (p) => <Receipt {...p} />,
  shield: (p) => <Shield {...p} />,
  scale: (p) => <Scale {...p} />,
  lock: (p) => <Lock {...p} />,
  sparkle: (p) => <Sparkles {...p} />,
  audit: (p) => <ClipboardList {...p} />,
  finance: (p) => <CircleDollarSign {...p} />,
  wallet: (p) => <Wallet {...p} />,
  messages: (p) => <MessageCircle {...p} />,
  user: (p) => <User {...p} />,
};

export function Icon({ name }: { name: IconKey }): ReactNode {
  const render = MAP[name];
  return render ? render(ICON_PROPS) : null;
}
