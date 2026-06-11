import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  buildRuntimePdfStaticCandidates,
  buildRuntimePdfStreamUrl,
} from "@/utils/buildRuntimePdfUrl";

const isPdfResponse = (response: Response) => {
  const type = response.headers.get("content-type") ?? "";
  return (
    response.ok &&
    (type.includes("application/pdf") || type.includes("application/octet-stream"))
  );
};

const canServeDirectPdf = async (url: string) => {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const response = await fetch(
        url,
        method === "GET" ? { headers: { Range: "bytes=0-0" } } : undefined,
      );
      if (isPdfResponse(response)) {
        return true;
      }
      if ((response.headers.get("content-type") ?? "").includes("text/html")) {
        return false;
      }
    } catch {
      // try next method / candidate
    }
  }
  return false;
};

const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const staticCandidates = buildRuntimePdfStaticCandidates(pathname);

    const resolvePdfSrc = async () => {
      for (const candidate of staticCandidates) {
        if (await canServeDirectPdf(candidate)) {
          if (!cancelled) {
            setPdfSrc(candidate);
          }
          return;
        }
      }

      if (!cancelled) {
        setPdfSrc(buildRuntimePdfStreamUrl(pathname));
      }
    };

    void resolvePdfSrc();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!pdfSrc) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
        <span className="sr-only">Opening PDF...</span>
      </div>
    );
  }

  return (
    <iframe
      src={pdfSrc}
      title="PDF document"
      className="fixed inset-0 h-full w-full border-0 bg-background"
    />
  );
};

export default RuntimePdfViewer;
