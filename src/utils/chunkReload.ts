const RELOAD_KEY = "app-chunk-reload";

export function isChunkLoadError(message: string) {
  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("error loading dynamically imported module")
  );
}

export function reloadForStaleChunks() {
  if (sessionStorage.getItem(RELOAD_KEY) === "1") {
    return false;
  }

  sessionStorage.setItem(RELOAD_KEY, "1");
  const url = new URL(window.location.href);
  url.searchParams.set("_cb", String(Date.now()));
  window.location.replace(url.toString());
  return true;
}

export function clearChunkReloadFlag() {
  sessionStorage.removeItem(RELOAD_KEY);
}
