"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { api } from "@/lib/messaging/api-client";
import type { Thread, CreateThreadPayload } from "@/lib/messaging/types";
import {
  ThreadList,
  ConversationView,
  NewThreadModal,
} from "@/components/messaging";
import "./messages.css";

const DEMO_MERCHANT_ID = "demo-merchant-001";
const DEMO_MERCHANT_NAME = "Blank Street Coffee";
const DEMO_MERCHANT_AVATAR =
  "https://api.dicebear.com/7.x/initials/svg?seed=BSC";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=merchant");
}

export default function MerchantMessagesPage() {
  const router = useRouter();
  const [selfUserId, setSelfUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [ready, setReady] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  useEffect(() => {
    const isDemo = checkDemoMode();

    if (isDemo) {
      setSelfUserId(DEMO_MERCHANT_ID);
      api.messages.listThreads("merchant", DEMO_MERCHANT_ID).then((ts) => {
        setThreads(ts);
        if (ts.length > 0) setActiveThreadId(ts[0].id);
        setReady(true);
      });
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/merchant/login");
        return;
      }
      const uid = data.user.id;
      setSelfUserId(uid);
      api.messages.listThreads("merchant", uid).then((ts) => {
        setThreads(ts);
        if (ts.length > 0) setActiveThreadId(ts[0].id);
        setReady(true);
      });
    });
  }, [router]);

  const handleSelect = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)),
    );
  }, []);

  const handleCreate = useCallback(
    async (payload: CreateThreadPayload) => {
      if (!selfUserId) return;
      const thread = await api.messages.createThread(
        payload,
        selfUserId,
        "merchant",
        DEMO_MERCHANT_NAME,
        DEMO_MERCHANT_AVATAR,
      );
      setThreads((prev) => [thread, ...prev]);
      setActiveThreadId(thread.id);
    },
    [selfUserId],
  );

  const handleThreadUpdate = useCallback(
    (_threadId: string) => {
      if (!selfUserId) return;
      api.messages
        .listThreads("merchant", selfUserId)
        .then((ts) => setThreads(ts));
    },
    [selfUserId],
  );

  if (!ready) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          background: "var(--surface)",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <>
      <div className="msg-layout">
        <ThreadList
          threads={threads}
          activeThreadId={activeThreadId}
          selfUserId={selfUserId!}
          onSelect={handleSelect}
          onNewThread={() => setShowModal(true)}
        />
        <ConversationView
          thread={activeThread}
          selfUserId={selfUserId!}
          selfRole="merchant"
          onThreadUpdate={handleThreadUpdate}
        />
      </div>

      {showModal && selfUserId && (
        <NewThreadModal
          selfRole="merchant"
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
