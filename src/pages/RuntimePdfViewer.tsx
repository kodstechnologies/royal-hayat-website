import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  buildRuntimePdfStreamUrl,
  isMobilePdfClient,
  openRuntimePdf,
} from "@/utils/buildRuntimePdfUrl";

const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const [useNativeViewer] = useState(() => isMobilePdfClient());
  const [openError, setOpenError] = useState(false);
  const streamUrl = buildRuntimePdfStreamUrl(pathname);

  useEffect(() => {
    if (!useNativeViewer) return;

    setOpenError(false);
    void openRuntimePdf(pathname).then((opened) => {
      if (!opened) setOpenError(true);
    });
  }, [pathname, useNativeViewer]);

  if (useNativeViewer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="font-body text-sm text-muted-foreground">
          {openError ? "Could not open PDF." : "Opening PDF…"}
        </p>
        <a
          href={streamUrl}
          className="font-body text-sm font-medium text-primary underline underline-offset-2"
        >
          Tap here if the document does not open
        </a>
      </div>
    );
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
