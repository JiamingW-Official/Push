"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useApplications } from "@/lib/creator/hooks/useApplications";
import CampaignList from "@/components/creator/lists/CampaignList";
import "./pipeline.css";

export default function WorkPipelinePage() {
  const [authUserId, setAuthUserId] = useState<string | undefined>(undefined);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setAuthUserId(data.user?.id);
      setAuthReady(true);
    });
  }, []);

  const { applications, loading } = useApplications(false, authUserId);
  const active = applications.filter(
    (a) => a.status === "accepted" && a.milestone !== "settled",
  );

  const isLoading = !authReady || loading;

  return (
    <div className="pipeline-page">
      <div className="pipeline-header">
        <h1 className="pipeline-title">Pipeline</h1>
        {!isLoading && (
          <span className="pipeline-count">{active.length} active</span>
        )}
      </div>
      {isLoading ? (
        <div className="pipeline-skeleton">
          {[1, 2, 3].map((n) => (
            <div key={n} className="pipeline-skeleton-row" />
          ))}
        </div>
      ) : (
        <CampaignList applications={active} />
      )}
    </div>
  );
}
