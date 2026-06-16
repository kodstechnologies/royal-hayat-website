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
