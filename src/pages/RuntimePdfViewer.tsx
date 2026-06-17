import { useLocation } from "react-router-dom";
import { buildRuntimePdfStreamUrl } from "@/utils/buildRuntimePdfUrl";

/** In-app fallback when client-side routing lands on a legacy PDF path. */
const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const streamUrl = buildRuntimePdfStreamUrl(pathname);

  return (
    <iframe
      src={streamUrl}
      title="PDF"
      className="fixed inset-0 w-full h-full border-0 bg-white"
    />
  );
};

export default RuntimePdfViewer;
