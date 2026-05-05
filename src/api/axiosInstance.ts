import axios from "axios";

const raw = import.meta.env.VITE_BACKEND_API_URL;
const trimmed = typeof raw === "string" ? raw.trim() : "";

/** In dev, same-origin `/api` is proxied by Vite (avoids CORS when using the Network URL or any non-matching Origin). */
const baseURL =
  import.meta.env.DEV ? "" : trimmed !== "" ? trimmed.replace(/\/+$/, "") : "";

const api = axios.create({
  baseURL,
});
export default api;
