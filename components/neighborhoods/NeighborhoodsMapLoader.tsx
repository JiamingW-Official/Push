"use client";

import dynamic from "next/dynamic";

const NeighborhoodsMap = dynamic(() => import("./NeighborhoodsMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--surface-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontFamily: "var(--font-body)",
      }}
    >
      Loading map…
    </div>
  ),
});

export default NeighborhoodsMap;
