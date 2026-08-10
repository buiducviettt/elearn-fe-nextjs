"use client";

import dynamic from "next/dynamic";

const MyQuestionConfigDragNoSSR = dynamic(() => import("./index"), {
  ssr: false,
});

export default MyQuestionConfigDragNoSSR; 