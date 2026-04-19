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

const DEMO_USER_ID = "demo-user-001";
const DEMO_USER_NAME = "Alex Chen";
const DEMO_USER_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

export default function CreatorMessagesPage() {
  const router = useRouter();
  const [selfUserId, setSelfUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [ready, setReady] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  // Auth + load threads
  useEffect(() => {
    const isDemo = checkDemoMode();

    if (isDemo) {
      setSelfUserId(DEMO_USER_ID);
      api.messages.listThreads("creator", DEMO_USER_ID).then((ts) => {
        setThreads(ts);
        if (ts.length > 0) setActiveThreadId(ts[0].id);
        setReady(true);
      });
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/creator/login");
        return;
      }
      const uid = data.user.id;
      setSelfUserId(uid);
      api.messages.listThreads("creator", uid).then((ts) => {
        setThreads(ts);
        if (ts.length > 0) setActiveThreadId(ts[0].id);
        setReady(true);
      });
    });
  }, [router]);

  const refreshThreads = useCallback(() => {
    if (!selfUserId) return;
    api.messages.listThreads("creator", selfUserId).then(setThreads);
  }, [selfUserId]);

  const handleSelect = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    // mark read optimistically in list
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
        "creator",
        DEMO_USER_NAME,
        DEMO_USER_AVATAR,
      );
      setThreads((prev) => [thread, ...prev]);
      setActiveThreadId(thread.id);
    },
    [selfUserId],
  );

  const handleThreadUpdate = useCallback(
    (threadId: string) => {
      if (!selfUserId) return;
      api.messages.listThreads("creator", selfUserId).then((ts) => {
        setThreads(ts);
        // keep active selection
        setActiveThreadId((prev) => (prev === threadId ? prev : prev));
      });
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
          fontFamily: "CS Genio Mono, monospace",
          fontSize: 13,
          color: "rgba(0,48,73,0.35)",
          background: "#f5f2ec",
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
          selfRole="creator"
          onThreadUpdate={handleThreadUpdate}
        />
      </div>

      {showModal && selfUserId && (
        <NewThreadModal
          selfRole="creator"
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
