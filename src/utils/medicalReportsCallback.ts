const MEDICAL_REPORTS_CALLBACK_BASE =
  (import.meta.env.VITE_MEDICAL_REPORTS_CALLBACK_URL as string | undefined)?.trim() ||
  "https://pcapplive.royalehayat.com/csp/healthshare/hscommunity/HS.Local.MEXX.HSPortal.OAuth2.KuwaitMobileId.Callback.cls";

export const buildMedicalReportsCallbackUrl = (civilId: string): string => {
  const url = new URL(MEDICAL_REPORTS_CALLBACK_BASE);
  url.searchParams.set("idn", civilId.trim());
  url.searchParams.set("externalauth", "KuwaitMobileID");
  return url.toString();
};
