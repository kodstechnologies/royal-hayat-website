export type PatientLookupErrorCode =
  | "PATIENT_NOT_FOUND"
  | "PATIENT_DUPLICATE_NATIONAL_ID"
  | "PATIENT_MERGED_URN"
  | "PATIENT_INACTIVE_OR_MERGED"
  | "PATIENT_INPUT_TOO_LONG"
  | "PATIENT_LOOKUP_UNAVAILABLE"
  | "PATIENT_LOOKUP_FAILED";

type TranslateFn = (key: string) => string;

/** Maps backend `meta.code` to LanguageContext keys (patient-facing alerts). */
const MESSAGE_KEYS: Record<PatientLookupErrorCode, string> = {
  PATIENT_NOT_FOUND: "patientNotFoundAfterPaci",
  PATIENT_DUPLICATE_NATIONAL_ID: "patientDuplicateNationalId",
  PATIENT_MERGED_URN: "patientMergedUrn",
  PATIENT_INACTIVE_OR_MERGED: "patientInactiveOrMerged",
  PATIENT_INPUT_TOO_LONG: "patientInputTooLong",
  PATIENT_LOOKUP_UNAVAILABLE: "patientLookupUnavailable",
  PATIENT_LOOKUP_FAILED: "patientLookupFailed",
};

/**
 * Maps TrakCare GET /WEBAPP/patient `status` strings to alert copy keys.
 * @see LanguageContext patientNotFoundAfterPaci, patientMergedUrn, etc.
 */
const classifyFromTrakCareStatus = (message: string): PatientLookupErrorCode => {
  const text = message.toLowerCase();

  // "Error: Patient not found"
  if (text.includes("patient not found") || text.includes("patient_exist")) {
    return "PATIENT_NOT_FOUND";
  }
  // "Error: URN belongs to a merged patient record" (before generic "has been merged")
  if (text.includes("urn belongs to a merged") || text.includes("belongs to a merged patient record")) {
    return "PATIENT_MERGED_URN";
  }
  // "Error: Multiple Patient with the Same National ID Found"
  if (text.includes("multiple patient") && text.includes("national id")) {
    return "PATIENT_DUPLICATE_NATIONAL_ID";
  }
  if (text.includes("multiple patient")) {
    return "PATIENT_DUPLICATE_NATIONAL_ID";
  }
  // "Error: Patient is inactive or has been merged"
  if (text.includes("inactive") || text.includes("has been merged")) {
    return "PATIENT_INACTIVE_OR_MERGED";
  }
  // "Error: Input too long, max 50 characters per identifier"
  if (text.includes("input too long") || text.includes("max 50 characters")) {
    return "PATIENT_INPUT_TOO_LONG";
  }

  return "PATIENT_LOOKUP_FAILED";
};

const isPatientLookupErrorCode = (value: string): value is PatientLookupErrorCode =>
  value in MESSAGE_KEYS;

export const extractPatientLookupError = (
  error: unknown
): { code: PatientLookupErrorCode; trakcareStatus: string } => {
  const axiosErr = error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        meta?: { code?: string; trakcare?: { status?: string; patient_exist?: boolean } };
      };
    };
    message?: string;
  };

  const data = axiosErr?.response?.data;
  const apiCode = data?.meta?.code;
  const trakcareStatus =
    data?.meta?.trakcare?.status || data?.message || axiosErr?.message || "";
  const httpStatus = axiosErr?.response?.status;

  let code: PatientLookupErrorCode =
    typeof apiCode === "string" && isPatientLookupErrorCode(apiCode)
      ? apiCode
      : classifyFromTrakCareStatus(String(trakcareStatus));

  if (data?.meta?.trakcare?.patient_exist === false && code === "PATIENT_LOOKUP_FAILED") {
    code = "PATIENT_NOT_FOUND";
  }

  if (!axiosErr?.response && axiosErr?.message) {
    code = "PATIENT_LOOKUP_UNAVAILABLE";
  }
  if (httpStatus && httpStatus >= 500 && code === "PATIENT_LOOKUP_FAILED") {
    code = "PATIENT_LOOKUP_UNAVAILABLE";
  }

  return { code, trakcareStatus: String(trakcareStatus) };
};

export const getPatientLookupUserMessage = (
  error: unknown,
  t: TranslateFn
): { code: PatientLookupErrorCode; text: string; showGoBack: boolean } => {
  const { code } = extractPatientLookupError(error);
  const key = MESSAGE_KEYS[code] || MESSAGE_KEYS.PATIENT_LOOKUP_FAILED;
  return {
    code,
    text: t(key),
    showGoBack: true,
  };
};

export const extractPatientId = (patientPayload: unknown): string | null => {
  if (!patientPayload || typeof patientPayload !== "object") return null;
  const p = patientPayload as Record<string, unknown>;
  const id = p.patient_id ?? p.patientId;
  if (id === null || id === undefined || id === "") return null;
  return String(id);
};
