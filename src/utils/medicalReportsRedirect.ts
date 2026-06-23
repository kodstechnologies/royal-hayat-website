const MEDICAL_REPORTS_CALLBACK_URL = import.meta.env.VITE_MEDICAL_REPORTS_CALLBACK_URL?.trim() ?? "";

export const buildMedicalReportsRedirectUrl = (civilId: string): string => {
  if (!MEDICAL_REPORTS_CALLBACK_URL) {
    throw new Error("VITE_MEDICAL_REPORTS_CALLBACK_URL is not configured");
  }

  const url = new URL(MEDICAL_REPORTS_CALLBACK_URL);
  url.searchParams.set("idn", civilId.trim());
  url.searchParams.set("externalauth", "KuwaitMobileID");
  return url.toString();
};
