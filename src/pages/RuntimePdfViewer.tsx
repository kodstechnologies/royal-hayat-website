import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { buildRuntimePdfUrl } from "@/utils/buildRuntimePdfUrl";

const RuntimePdfViewer = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.location.replace(buildRuntimePdfUrl(pathname));
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      <span className="sr-only">Opening PDF...</span>
    </div>
  );
};

export default RuntimePdfViewer;
