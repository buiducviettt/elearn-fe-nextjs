import dynamic from "next/dynamic";

const MyEditorNoSSR = dynamic(() => import("./index"), {
  ssr: false,
});

export default MyEditorNoSSR;
