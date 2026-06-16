import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  buildRuntimePdfStreamUrl,
  isIOSPdfClient,
} from "@/utils/buildRuntimePdfUrl";

const embedClassName = "fixed inset-0 h-full w-full border-0 bg-background";

const RuntimePdfViewer = () => {
  const { pathname } = useLocation();
  const streamUrl = buildRuntimePdfStreamUrl(pathname);
  const isIOS = isIOSPdfClient();

  useLayoutEffect(() => {
    if (!isIOS) return;
    window.location.replace(streamUrl);
  }, [isIOS, streamUrl]);

  if (isIOS) {
    return null;
  }

  return (
    <object
      data={streamUrl}
      type="application/pdf"
      className={embedClassName}
      aria-label="PDF document"
    >
      <iframe src={streamUrl} title="PDF document" className={embedClassName} />
    </object>
  );
};

export default RuntimePdfViewer;
