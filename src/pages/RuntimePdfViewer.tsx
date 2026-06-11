import { useLocation } from "react-router-dom";
import { buildRuntimePdfStreamUrl } from "@/utils/buildRuntimePdfUrl";

const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const pdfSrc = buildRuntimePdfStreamUrl(pathname);

  return (
    <iframe
      src={pdfSrc}
      title="PDF document"
      className="fixed inset-0 h-full w-full border-0 bg-background"
    />
  );
};

export default RuntimePdfViewer;
