export type AfyatiLoginErrorPayload = {
  reason: string;
  message: string;
};

const pickString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const readNested = (source: Record<string, unknown> | null | undefined, key: string): unknown =>
  source && typeof source === "object" ? source[key] : undefined;

export const parseAfyatiLoginErrorPayload = (
  searchParams: URLSearchParams,
): AfyatiLoginErrorPayload => {
  const reason = pickString(
    searchParams.get("reason"),
    searchParams.get("errorReason"),
    searchParams.get("error_reason"),
    searchParams.get("error"),
    searchParams.get("code"),
  );

  const message = pickString(
    searchParams.get("message"),
    searchParams.get("errorMessage"),
    searchParams.get("error_message"),
    searchParams.get("error_description"),
    searchParams.get("description"),
    searchParams.get("detail"),
  );

  return { reason, message };
};

export const parseAfyatiLoginErrorBody = (body: unknown): AfyatiLoginErrorPayload => {
  const root = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const nested =
    (readNested(root, "payload") as Record<string, unknown> | undefined) ||
    (readNested(root, "error") as Record<string, unknown> | undefined) ||
    root;

  const reason = pickString(
    nested.reason,
    nested.errorReason,
    nested.error_reason,
    nested.error,
    nested.code,
    root.reason,
    root.errorReason,
    root.error,
  );

  const message = pickString(
    nested.message,
    nested.errorMessage,
    nested.error_message,
    nested.error_description,
    nested.description,
    nested.detail,
    root.message,
    root.errorMessage,
    root.error_description,
  );

  return { reason, message };
};
