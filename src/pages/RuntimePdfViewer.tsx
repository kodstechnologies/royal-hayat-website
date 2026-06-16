import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  buildRuntimePdfStreamUrl,
  isMobilePdfClient,
} from "@/utils/buildRuntimePdfUrl";

const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const streamUrl = buildRuntimePdfStreamUrl(pathname);
  const isMobile = isMobilePdfClient();

  useLayoutEffect(() => {
    if (!isMobile) return;
    window.location.replace(streamUrl);
  }, [isMobile, streamUrl]);

  if (isMobile) {
    return null;
  }

  return (
    <iframe
      src={streamUrl}
      title="PDF document"
      className="fixed inset-0 h-full w-full border-0 bg-background"
    />
  );
};

export default RuntimePdfViewer;
