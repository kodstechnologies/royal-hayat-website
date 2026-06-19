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

const RUNTIME_PDF_PATH_RE =
  /^\/(?:Runtime\/uploads|wp-content\/uploads)\/.+\.pdf$/i;

export function isRuntimePdfPath(pathOrFilename: string): boolean {
  const trimmed = pathOrFilename.trim();
  if (!trimmed.startsWith("/")) return false;
  return RUNTIME_PDF_PATH_RE.test(trimmed.split("?")[0].split("#")[0]);
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
 * Best href for opening a PDF on the current device.
 * Mobile clients skip the React iframe viewer and load the PDF stream directly.
 */
export function getRuntimePdfHref(pathOrFilename: string): string {
  if (isMobilePdfClient()) {
    return buildRuntimePdfStreamUrl(pathOrFilename);
  }
  return buildRuntimePdfUrl(pathOrFilename);
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

/** Direct PDF stream — skips the React app so the browser shows the file immediately. */
export function buildRuntimePdfOpenUrl(pathOrFilename: string): string {
  return buildRuntimePdfStreamUrl(pathOrFilename);
}

/**
 * Hard redirect before React mounts (full page load on a legacy PDF URL).
 * Returns true when a redirect was started.
 */
export function redirectRuntimePdfIfNeeded(pathname: string): boolean {
  if (!isRuntimePdfPath(pathname) || !isMobilePdfClient()) {
    return false;
  }
  window.location.replace(buildRuntimePdfStreamUrl(pathname));
  return true;
}

/**
 * Opens a legacy PDF path on the current device.
 */
export function openRuntimePdf(pathOrFilename: string): void {
  window.location.assign(getRuntimePdfHref(pathOrFilename));
}
