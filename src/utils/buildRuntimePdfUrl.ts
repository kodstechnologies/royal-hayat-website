/**
 * Legacy path with encoded segments (%20 = space in the filename on disk).
 * e.g. /Runtime/uploads/Birth%20plan%20booklet_27May2021_final.pdf
 *   → Birth plan booklet_27May2021_final.pdf in public/Runtime/uploads/
 */
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
