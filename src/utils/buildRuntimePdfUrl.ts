/** iOS/Android Safari and Chrome mishandle PDFs embedded in iframes — open the file directly. */
export function isMobilePdfClient(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  return isIOS || isAndroid;
}

export function isAndroidPdfClient(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

/** Relative legacy path with encoded segments, e.g. /Runtime/uploads/foo%20bar.pdf */
export function buildRuntimePdfPath(pathOrFilename: string): string {
  const trimmed = pathOrFilename.trim();
  const path = trimmed.startsWith("/") ? trimmed : `/Runtime/uploads/${trimmed}`;
  const segments = path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)));

  return `/${segments.join("/")}`;
}

/**
 * Public link URL — same origin, legacy path (no backend IP in the address bar).
 * e.g. /Runtime/uploads/AlLiwan_%20menu_2021.pdf
 */
export function buildRuntimePdfUrl(pathOrFilename: string): string {
  return buildRuntimePdfPath(pathOrFilename);
}

/**
 * Internal stream URL for the PDF viewer iframe — proxied via /api on the site domain.
 */
export function buildRuntimePdfStreamUrl(pathOrFilename: string): string {
  const legacyPath = buildRuntimePdfPath(pathOrFilename).replace(/^\//, "");
  const encoded = legacyPath
    .split("/")
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/");
  return `/api/v1/runtime-pdf-viewer/file/${encoded}`;
}

/** Best URL for the current device — direct stream on mobile, in-app viewer route on desktop. */
export function buildRuntimePdfOpenUrl(pathOrFilename: string): string {
  if (isMobilePdfClient()) {
    return buildRuntimePdfStreamUrl(pathOrFilename);
  }
  return buildRuntimePdfUrl(pathOrFilename);
}

export function buildRuntimePdfAbsoluteStreamUrl(pathOrFilename: string): string {
  const streamPath = buildRuntimePdfStreamUrl(pathOrFilename);
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${streamPath}`;
  }
  return streamPath;
}

function openGooglePdfViewer(pathOrFilename: string) {
  const absoluteStream = buildRuntimePdfAbsoluteStreamUrl(pathOrFilename);
  window.location.assign(
    `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(absoluteStream)}`,
  );
}

/**
 * Opens a legacy PDF path on the current device.
 * Android Chrome (incl. 12) often fails when the SPA navigates to a PDF URL — fetch + blob is more reliable.
 */
export async function openRuntimePdf(pathOrFilename: string): Promise<boolean> {
  const streamUrl = buildRuntimePdfStreamUrl(pathOrFilename);
  const viewerUrl = buildRuntimePdfUrl(pathOrFilename);

  if (!isMobilePdfClient()) {
    window.open(viewerUrl, "_blank", "noopener,noreferrer");
    return true;
  }

  try {
    const response = await fetch(streamUrl, { credentials: "same-origin" });
    if (!response.ok) {
      if (isAndroidPdfClient()) {
        openGooglePdfViewer(pathOrFilename);
      } else {
        window.location.assign(streamUrl);
      }
      return true;
    }

    const buffer = await response.arrayBuffer();
    const blobUrl = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
    window.location.assign(blobUrl);
    return true;
  } catch {
    try {
      window.location.assign(streamUrl);
      return true;
    } catch {
      if (isAndroidPdfClient()) {
        openGooglePdfViewer(pathOrFilename);
        return true;
      }
      return false;
    }
  }
}
