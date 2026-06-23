import { useLayoutEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDocumentStreamUrl } from "@/hooks/useDocumentStreamUrl";
import { isMobilePdfClient } from "@/utils/buildRuntimePdfUrl";

/** In-app fallback when client-side routing lands on a legacy PDF path. */
const RuntimePdfViewer = () => {
  const { pathname, search } = useLocation();
  const explicitVersion = useMemo(
    () => new URLSearchParams(search).get("v"),
    [search],
  );
  const { streamUrl, ready } = useDocumentStreamUrl(pathname, explicitVersion);

  useLayoutEffect(() => {
    if (!ready || !streamUrl) return;
    if (isMobilePdfClient()) {
      window.location.replace(streamUrl);
    }
  }, [ready, streamUrl]);

  if (!ready || !streamUrl) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white text-slate-500 text-sm">
        Loading document…
      </div>
    );
  }

  if (isMobilePdfClient()) {
    return null;
  }

  return (
    <iframe
      key={streamUrl}
      src={streamUrl}
      title="PDF"
      className="fixed inset-0 w-full h-full border-0 bg-white"
      style={{ WebkitOverflowScrolling: "touch" }}
    />
  );
};

export default RuntimePdfViewer;
