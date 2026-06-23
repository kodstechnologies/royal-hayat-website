import { useEffect, useState } from "react";
import { fetchDocumentPublicMeta } from "@/api/document";
import { buildRuntimePdfStreamUrl } from "@/utils/buildRuntimePdfUrl";

/**
 * Resolves the PDF stream URL for a public path.
 * Fetches contentVersion from the API so same-path file updates bust browser cache.
 */
export function useDocumentStreamUrl(
  pathname: string,
  explicitVersion?: string | null,
) {
  const [cacheVersion, setCacheVersion] = useState<string | null>(
    explicitVersion ?? null,
  );
  const [ready, setReady] = useState(Boolean(explicitVersion));

  useEffect(() => {
    if (explicitVersion) {
      setCacheVersion(explicitVersion);
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    fetchDocumentPublicMeta(pathname)
      .then((meta) => {
        if (cancelled) return;
        setCacheVersion(
          meta?.contentVersion != null ? String(meta.contentVersion) : null,
        );
      })
      .catch(() => {
        if (!cancelled) {
          setCacheVersion(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, explicitVersion]);

  const streamUrl = ready
    ? `${buildRuntimePdfStreamUrl(pathname, cacheVersion ?? undefined)}#view=FitH`
    : null;

  return { streamUrl, ready, cacheVersion };
}
