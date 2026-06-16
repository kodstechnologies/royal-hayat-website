/** iOS Safari mishandles PDFs in iframes — open the stream URL directly instead. */
export function isIOSPdfClient(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  return (
    /iPad|iPhone|iPod/i.test(ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1)
  );
}

export function isAndroidPdfClient(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

/** iOS/Android — use platform-specific open/embed behaviour. */
export function isMobilePdfClient(): boolean {
  return isIOSPdfClient() || isAndroidPdfClient();
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

/**
 * Best href for links:
 * - iOS: stream URL (native viewer)
 * - Android / desktop: legacy path → viewer embeds the PDF inline
 */
export function buildRuntimePdfOpenUrl(pathOrFilename: string): string {
  if (isIOSPdfClient()) {
    return buildRuntimePdfStreamUrl(pathOrFilename);
  }
  return buildRuntimePdfUrl(pathOrFilename);
}

/**
 * Opens a legacy PDF path on the current device.
 */
export function openRuntimePdf(pathOrFilename: string): void {
  if (!isMobilePdfClient()) {
    window.open(buildRuntimePdfUrl(pathOrFilename), "_blank", "noopener,noreferrer");
    return;
  }

  if (isIOSPdfClient()) {
    window.location.assign(buildRuntimePdfStreamUrl(pathOrFilename));
    return;
  }

  window.location.assign(buildRuntimePdfUrl(pathOrFilename));
}
