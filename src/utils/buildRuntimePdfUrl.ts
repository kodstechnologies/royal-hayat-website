/** Backend base URL for legacy PDFs (direct — no frontend proxy). */
export function getBackendPdfBase(): string {
  const raw = import.meta.env.VITE_BACKEND_API_URL;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (trimmed) {
    return trimmed.replace(/\/+$/, "");
  }
  return import.meta.env.DEV ? "http://localhost:8001" : "";
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

/** Full backend URL for opening a legacy PDF directly. */
export function buildRuntimePdfUrl(pathOrFilename: string): string {
  const base = getBackendPdfBase();
  const path = buildRuntimePdfPath(pathOrFilename);
  return `${base}${path}`;
}
