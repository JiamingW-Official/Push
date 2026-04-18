"use client";

import dynamic from "next/dynamic";

const NeighborhoodsClient = dynamic(() => import("./NeighborhoodsClient"), {
  ssr: false,
});

export default NeighborhoodsClient;
