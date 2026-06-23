import { getBackendApiBase } from "./backendBase";

export type DocumentPublicMeta = {
  publicPath: string;
  contentVersion: string | number;
  updatedAt?: string | null;
};

export async function fetchDocumentPublicMeta(
  publicPath: string,
): Promise<DocumentPublicMeta | null> {
  const base = getBackendApiBase();
  const url = `${base}/api/v1/documents/public/resolve?path=${encodeURIComponent(publicPath)}`;
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json?.data ?? null;
}
