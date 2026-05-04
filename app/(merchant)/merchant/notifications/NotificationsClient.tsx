'use client';

import { useMemo, useState } from 'react';
import { EmptyState, FilterTabs, PageHeader, StatusBadge } from '@/components/merchant/shared';
import './notifications.css';

type NotificationFilter = 'all' | 'unread' | 'mentions' | 'system';
type NotificationStatus = 'active' | 'paused' | 'draft' | 'closed' | undefined;

interface MerchantNotification {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  read: boolean;
  filter: Exclude<NotificationFilter, 'all' | 'unread'>;
  status?: NotificationStatus;
}

const tabs = [
  { value: 'all', label: 'all' },
  { value: 'unread', label: 'unread' },
  { value: 'mentions', label: 'mentions' },
  { value: 'system', label: 'system' },
];

const notifications: MerchantNotification[] = [
  {
    id: 'n-1',
    title: 'Creator tagged your campaign in a Reel',
    subtitle: 'Mention from @kaya.food in Spring Launch campaign',
    timestamp: '5m ago',
    read: false,
    filter: 'mentions',
    status: 'active',
  },
  {
    id: 'n-2',
    title: 'SLA reminder for payout approval',
    subtitle: 'One payout request enters SLA breach in 2 hours',
    timestamp: '32m ago',
    read: false,
    filter: 'system',
    status: 'paused',
  },
  {
    id: 'n-3',
    title: 'New creator activity snapshot ready',
    subtitle: 'Weekly engagement digest is available in analytics',
    timestamp: '2h ago',
    read: true,
    filter: 'system',
    status: 'draft',
  },
  {
    id: 'n-4',
    title: 'Comment thread resolved',
    subtitle: 'Dispute ticket #247 was closed by operations',
    timestamp: 'Yesterday',
    read: true,
    filter: 'mentions',
    status: 'closed',
  },
];

function NotificationIcon() {
  return (
    <svg className="notif-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="14" height="14" stroke="currentColor" />
      <path d="M6 8h8M6 11h8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function NotificationsClient() {
  const [activeTab, setActiveTab] = useState<NotificationFilter>('all');
  const [forceEmpty, setForceEmpty] = useState(false);

  const filtered = useMemo(() => {
    if (forceEmpty) {
      return [];
    }

    if (activeTab === 'all') {
      return notifications;
    }

    if (activeTab === 'unread') {
      return notifications.filter((item) => !item.read);
    }

    return notifications.filter((item) => item.filter === activeTab);
  }, [activeTab, forceEmpty]);

  return (
    <section className="notif-page">
      <PageHeader eyebrow="INBOX" title="Notifications" subtitle="Alerts, SLA reminders, creator activity." />

      <div className="notif-actions">
        <button className="notif-toggle" type="button" onClick={() => setForceEmpty((v) => !v)}>
          {forceEmpty ? 'Show notifications' : 'Show empty state'}
        </button>
      </div>

      <FilterTabs tabs={tabs} value={activeTab} onChange={(value) => setActiveTab(value as NotificationFilter)} />

      {filtered.length === 0 ? (
        <div className="notif-empty-wrap">
          <EmptyState title="All caught up" description="No new notifications." />
        </div>
      ) : (
        <ul className="notif-list" aria-label="Notifications list">
          {filtered.map((item) => (
            <li key={item.id} className={`notif-item ${item.read ? 'notif-item--read' : 'notif-item--unread'}`}>
              <NotificationIcon />
              <div className="notif-body">
                <div className="notif-row">
                  <h3 className="notif-title">{item.title}</h3>
                  {item.status ? <StatusBadge status={item.status} /> : null}
                </div>
                <p className="notif-subtitle">{item.subtitle}</p>
              </div>
              <time className="notif-time">{item.timestamp}</time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
