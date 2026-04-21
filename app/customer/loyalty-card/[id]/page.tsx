import LoyaltyCard from "@/components/customer/LoyaltyCard";
import "./loyalty-card.css";

// Next.js 15+ route-param API — params is a Promise that must be awaited
// inside the async server component.
interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Seed a mock loyalty card for the given id. Session 3-6 ships with
 * deterministic mock data — the final URL-to-DB wiring lands in the
 * Week 4 customer integration session.
 */
function getMockLoyaltyCard(id: string) {
  return {
    id,
    merchant_name: "Coffee Plus Downtown",
    creator_name: "Lucy",
    current_stamps: 4,
    max_stamps: 10,
    qr_code: null as string | null,
    numeric_code: "12345-67890-12345",
    redeemed_at: null as string | null,
    created_at: "2026-04-01T10:30:00Z",
  };
}

export default async function LoyaltyCardPage({ params }: PageProps) {
  const { id } = await params;
  const card = getMockLoyaltyCard(id);

  return (
    <div className="loyalty-shell">
      <div className="loyalty-topbar">
        <a href="/" className="loyalty-back" aria-label="返回首页">
          <span aria-hidden="true">←</span> 返回首页
        </a>
      </div>

      <LoyaltyCard
        merchant_name={card.merchant_name}
        creator_name={card.creator_name}
        current_stamps={card.current_stamps}
        max_stamps={card.max_stamps}
        qr_code={card.qr_code}
        numeric_code={card.numeric_code}
        redeemed_at={card.redeemed_at}
      />

      <p className="loyalty-footer">卡片 ID · {card.id}</p>
    </div>
  );
}
