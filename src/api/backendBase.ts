/**
 * Backend API origin for production builds.
 * - Dev: "" so Vite proxies /api to localhost:8000.
 * - Prod: VITE_BACKEND_API_URL, unless the page is HTTPS and the env URL is HTTP
 *   (mixed content) — then same-origin is used (nginx must proxy /api to the backend).
 */
export function getBackendApiBase(): string {
  if (import.meta.env.DEV) {
    return "";
  }

  const raw = import.meta.env.VITE_BACKEND_API_URL;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (!trimmed) {
    return "";
  }

  const base = trimmed.replace(/\/+$/, "");

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    base.startsWith("http://")
  ) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return base;
}
