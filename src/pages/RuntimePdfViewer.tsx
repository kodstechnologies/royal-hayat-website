import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { buildRuntimePdfStreamUrl } from "@/utils/buildRuntimePdfUrl";

/** Fallback when client-side routing lands on a legacy PDF path without a full reload. */
const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const streamUrl = buildRuntimePdfStreamUrl(pathname);

  useLayoutEffect(() => {
    window.location.replace(streamUrl);
  }, [streamUrl]);

  return null;
};

export default RuntimePdfViewer;
