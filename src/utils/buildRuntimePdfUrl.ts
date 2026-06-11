/**
 * Legacy QR URLs sometimes use spaces; static files in public/ use underscores
 * so deploy + Linux serving stay reliable.
 */
const STATIC_PDF_FILENAME_ALIASES: Record<string, string> = {
  "Birth plan booklet_27May2021_final.pdf": "Birth_plan_booklet_27May2021_final.pdf",
};

const encodePathSegments = (pathname: string) =>
  pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)));

/** Relative legacy path with encoded segments, e.g. /Runtime/uploads/foo%20bar.pdf */
export function buildRuntimePdfPath(pathOrFilename: string): string {
  const trimmed = pathOrFilename.trim();
  const path = trimmed.startsWith("/") ? trimmed : `/Runtime/uploads/${trimmed}`;
  return `/${encodePathSegments(path).join("/")}`;
}

/** Static asset path(s) to try for a legacy pathname (alias filenames first). */
export function buildRuntimePdfStaticCandidates(pathOrFilename: string): string[] {
  const legacyPath = buildRuntimePdfPath(pathOrFilename);
  const segments = legacyPath.split("/").filter(Boolean);
  const fileSegment = segments[segments.length - 1];
  if (!fileSegment) return [legacyPath];

  const decodedName = decodeURIComponent(fileSegment);
  const aliasName = STATIC_PDF_FILENAME_ALIASES[decodedName];
  const prefix = segments.slice(0, -1);

  const candidates = new Set<string>();
  if (aliasName) {
    candidates.add(`/${[...prefix, encodeURIComponent(aliasName)].join("/")}`);
  }
  candidates.add(legacyPath);

  return [...candidates];
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
