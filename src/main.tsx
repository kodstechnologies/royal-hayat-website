import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isChunkLoadError, reloadForStaleChunks } from "./utils/chunkReload";
import { redirectRuntimePdfIfNeeded } from "./utils/buildRuntimePdfUrl";

window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  reloadForStaleChunks();
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message = reason instanceof Error ? reason.message : String(reason ?? "");
  if (isChunkLoadError(message)) {
    event.preventDefault();
    reloadForStaleChunks();
  }
});

if (!redirectRuntimePdfIfNeeded(window.location.pathname)) {
  createRoot(document.getElementById("root")!).render(<App />);
}
