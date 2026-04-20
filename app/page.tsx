'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DemoStats {
  merchants: number;
  creators: number;
  loyaltyCards: number;
  weeklyReports: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<DemoStats>({
    merchants: 0,
    creators: 0,
    loyaltyCards: 0,
    weeklyReports: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setStats({
        merchants: 5,
        creators: 10,
        loyaltyCards: 15,
        weeklyReports: 10
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const navigationCards = [
    {
      href: '/admin/dashboard',
      title: 'Admin Dashboard',
      emoji: '⚙️',
      description: 'Merchant KPIs, creator recruitment, AI verification',
      color: '#c1121f' // Flag Red
    },
    {
      href: '/creator/dashboard',
      title: 'Creator Dashboard',
      emoji: '🎬',
      description: 'Earnings, campaigns, leaderboard, recruitment status',
      color: '#669bbc' // Steel Blue
    },
    {
      href: '/customer/loyalty-card/demo-card-001',
      title: 'Customer Loyalty Card',
      emoji: '🎫',
      description: 'Punch card interface, merchant details, promotions',
      color: '#003049' // Deep Space Blue
    },
    {
      href: '/merchant/dashboard',
      title: 'Merchant Dashboard',
      emoji: '🏪',
      description: 'Campaign management, creator leaderboard, analytics',
      color: '#780000' // Molten Lava
    }
  ];

  return (
    <main
      style={{
        backgroundColor: '#f5f2ec',
        minHeight: '100vh',
        padding: '64px 32px'
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: '80px', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'Darky, sans-serif',
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            color: '#003049'
          }}
        >
          Push v5.2
        </h1>
        <p
          style={{
            fontFamily: 'CS Genio Mono, monospace',
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px'
          }}
        >
          Vertical AI for Local Commerce
        </p>

        {/* Demo Statistics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            marginTop: '40px'
          }}
        >
          <div style={{ padding: '16px', border: '2px solid #c1121f' }}>
            <div
              style={{
                fontFamily: 'Darky, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#c1121f'
              }}
            >
              {isLoading ? '—' : stats.merchants}
            </div>
            <div
              style={{
                fontFamily: 'CS Genio Mono, monospace',
                fontSize: '12px',
                color: '#999',
                marginTop: '8px'
              }}
            >
              Merchants
            </div>
          </div>

          <div style={{ padding: '16px', border: '2px solid #669bbc' }}>
            <div
              style={{
                fontFamily: 'Darky, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#669bbc'
              }}
            >
              {isLoading ? '—' : stats.creators}
            </div>
            <div
              style={{
                fontFamily: 'CS Genio Mono, monospace',
                fontSize: '12px',
                color: '#999',
                marginTop: '8px'
              }}
            >
              Creators
            </div>
          </div>

          <div style={{ padding: '16px', border: '2px solid #003049' }}>
            <div
              style={{
                fontFamily: 'Darky, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#003049'
              }}
            >
              {isLoading ? '—' : stats.loyaltyCards}
            </div>
            <div
              style={{
                fontFamily: 'CS Genio Mono, monospace',
                fontSize: '12px',
                color: '#999',
                marginTop: '8px'
              }}
            >
              Loyalty Cards
            </div>
          </div>

          <div style={{ padding: '16px', border: '2px solid #780000' }}>
            <div
              style={{
                fontFamily: 'Darky, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#780000'
              }}
            >
              {isLoading ? '—' : stats.weeklyReports}
            </div>
            <div
              style={{
                fontFamily: 'CS Genio Mono, monospace',
                fontSize: '12px',
                color: '#999',
                marginTop: '8px'
              }}
            >
              Weekly Reports
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {navigationCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div
              style={{
                border: `2px solid ${card.color}`,
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff'
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = `0 8px 16px rgba(0,0,0,0.1)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}
              >
                {card.emoji}
              </div>
              <h2
                style={{
                  fontFamily: 'Darky, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: '#003049'
                }}
              >
                {card.title}
              </h2>
              <p
                style={{
                  fontFamily: 'CS Genio Mono, monospace',
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.5'
                }}
              >
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '80px',
          textAlign: 'center',
          borderTop: '1px solid #ddd',
          paddingTop: '40px'
        }}
      >
        <p
          style={{
            fontFamily: 'CS Genio Mono, monospace',
            fontSize: '12px',
            color: '#999'
          }}
        >
          YC Demo Day: May 9, 2026 | Week 3: UI & Dashboards
        </p>
      </div>
    </main>
  );
}
