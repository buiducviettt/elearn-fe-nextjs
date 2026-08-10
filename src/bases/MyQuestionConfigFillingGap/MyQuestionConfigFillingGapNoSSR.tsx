"use client";

import dynamic from "next/dynamic";

const MyQuestionConfigFillingGapNoSSR = dynamic(() => import("./index"), {
  ssr: false,
});

export default MyQuestionConfigFillingGapNoSSR;
