import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  buildRuntimePdfStreamUrl,
  isMobilePdfClient,
} from "@/utils/buildRuntimePdfUrl";

/** In-app fallback when client-side routing lands on a legacy PDF path. */
const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const streamUrl = `${buildRuntimePdfStreamUrl(pathname)}#view=FitH`;

  useLayoutEffect(() => {
    if (isMobilePdfClient()) {
      window.location.replace(streamUrl);
    }
  }, [streamUrl]);

  if (isMobilePdfClient()) {
    return null;
  }

  return (
    <iframe
      src={streamUrl}
      title="PDF"
      className="fixed inset-0 w-full h-full border-0 bg-white"
      style={{ WebkitOverflowScrolling: "touch" }}
    />
  );
};

export default RuntimePdfViewer;
