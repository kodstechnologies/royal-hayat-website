import { useLocation } from "react-router-dom";
import { buildRuntimePdfPath } from "@/utils/buildRuntimePdfUrl";

/**
 * Legacy URL uses %20 for spaces, e.g.
 * /Runtime/uploads/Birth%20plan%20booklet_27May2021_final.pdf
 * → public/dist file: Runtime/uploads/Birth plan booklet_27May2021_final.pdf
 */
const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const pdfSrc = buildRuntimePdfPath(pathname);

  return (
    <iframe
      src={pdfSrc}
      title="PDF document"
      className="fixed inset-0 h-full w-full border-0 bg-background"
    />
  );
};

export default RuntimePdfViewer;
