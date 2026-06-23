import { useLocation } from "react-router-dom";
import { isRuntimePdfPath } from "@/utils/buildRuntimePdfUrl";
import RuntimePdfViewer from "./RuntimePdfViewer";
import NotFound from "./NotFound";

/** Serves uploaded/public files at any custom path before falling back to 404. */
const PublicDocumentRoute = () => {
  const { pathname } = useLocation();

  if (isRuntimePdfPath(pathname)) {
    return <RuntimePdfViewer />;
  }

  return <NotFound />;
};

export default PublicDocumentRoute;
