"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import CampaignCard from "@/components/ui/CampaignCard";
import type { CampaignPin } from "@/components/layout/MapView";
import "./dashboard.css";

// SSR disabled — Leaflet requires window
const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
});

type Campaign = CampaignPin & {
  deadline?: string | null;
  description?: string | null;
};

// Default center: NYC (beachhead market)
const NYC: [number, number] = [40.7128, -74.006];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      // Auth check
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.replace("/creator/signup");
        return;
      }

      setUser({ email: authUser.email });

      // Fetch active campaigns
      const { data } = await supabase
        .from("campaigns")
        .select(
          `
          id,
          title,
          description,
          payout,
          spots_remaining,
          deadline,
          lat,
          lng,
          merchants ( business_name )
        `,
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        const pins: Campaign[] = data
          .filter((c) => c.lat != null && c.lng != null)
          .map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            payout: Number(c.payout),
            spots_remaining: c.spots_remaining,
            deadline: c.deadline,
            lat: c.lat as number,
            lng: c.lng as number,
            business_name:
              (c.merchants as unknown as { business_name: string } | null)
                ?.business_name ?? "Local Business",
          }));
        setCampaigns(pins);
      }

      setAuthLoading(false);
    }

    init();
  }, [router]);

  if (authLoading) {
    return <div className="loading">Loading…</div>;
  }

  const mapCenter: [number, number] =
    campaigns.length > 0 ? [campaigns[0].lat, campaigns[0].lng] : NYC;

  return (
    <div className="dashboard">
      {/* Nav */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          Push
        </Link>
        <span className="nav-title">Creator Dashboard</span>
        <div className="nav-right">
          <span className="nav-user">{user?.email}</span>
          <SignOutButton />
        </div>
      </nav>

      {/* Main */}
      <div className="main">
        {/* Map */}
        <div className="map-pane">
          <MapView
            campaigns={campaigns}
            center={mapCenter}
            activeId={activeId}
            onPinClick={setActiveId}
          />
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Nearby Campaigns</h2>
            <p className="sidebar-count">
              {campaigns.length > 0
                ? `${campaigns.length} active campaign${campaigns.length !== 1 ? "s" : ""}`
                : "No active campaigns yet"}
            </p>
          </div>

          <div className="campaign-list">
            {campaigns.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📍</div>
                <h3 className="empty-title">No campaigns yet</h3>
                <p className="empty-body">
                  Active campaigns from local businesses will appear here. Check
                  back soon — Push is launching in NYC.
                </p>
              </div>
            ) : (
              campaigns.map((c) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  active={activeId === c.id}
                  onClick={() =>
                    setActiveId(activeId === c.id ? undefined : c.id)
                  }
                />
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/creator/signup");
  }

  return (
    <button
      className="btn btn-ghost"
      style={{ padding: "4px 12px", fontSize: "12px" }}
      onClick={signOut}
    >
      Sign out
    </button>
  );
}
