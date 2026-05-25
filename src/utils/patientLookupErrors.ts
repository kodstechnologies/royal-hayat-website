export type PatientLookupErrorCode =
  | "PATIENT_NOT_FOUND"
  | "PATIENT_DUPLICATE_NATIONAL_ID"
  | "PATIENT_MERGED_URN"
  | "PATIENT_INACTIVE_OR_MERGED"
  | "PATIENT_INPUT_TOO_LONG"
  | "PATIENT_LOOKUP_UNAVAILABLE"
  | "PATIENT_LOOKUP_FAILED";

type TranslateFn = (key: string) => string;

const MESSAGE_KEYS: Record<PatientLookupErrorCode, string> = {
  PATIENT_NOT_FOUND: "patientNotFoundAfterPaci",
  PATIENT_DUPLICATE_NATIONAL_ID: "patientDuplicateNationalId",
  PATIENT_MERGED_URN: "patientMergedUrn",
  PATIENT_INACTIVE_OR_MERGED: "patientInactiveOrMerged",
  PATIENT_INPUT_TOO_LONG: "patientInputTooLong",
  PATIENT_LOOKUP_UNAVAILABLE: "patientLookupUnavailable",
  PATIENT_LOOKUP_FAILED: "patientLookupFailed",
};

const classifyFromMessage = (message: string): PatientLookupErrorCode => {
  const text = message.toLowerCase();
  if (text.includes("not found")) {
    return "PATIENT_NOT_FOUND";
  }
  if (text.includes("multiple patient")) {
    return "PATIENT_DUPLICATE_NATIONAL_ID";
  }
  if (text.includes("merged patient record") || text.includes("urn belongs to a merged")) {
    return "PATIENT_MERGED_URN";
  }
  if (text.includes("inactive") || text.includes("has been merged")) {
    return "PATIENT_INACTIVE_OR_MERGED";
  }
  if (text.includes("input too long")) {
    return "PATIENT_INPUT_TOO_LONG";
  }
  if (text.includes("network") || text.includes("failed to fetch") || text.includes("unavailable")) {
    return "PATIENT_LOOKUP_UNAVAILABLE";
  }
  return "PATIENT_LOOKUP_FAILED";
};

export const extractPatientLookupError = (
  error: unknown
): { code: PatientLookupErrorCode; message: string } => {
  const axiosErr = error as {
    response?: { status?: number; data?: { message?: string; meta?: { code?: string } } };
    message?: string;
  };
  const apiCode = axiosErr?.response?.data?.meta?.code;
  const apiMessage = axiosErr?.response?.data?.message || axiosErr?.message || "";
  const httpStatus = axiosErr?.response?.status;

  let code: PatientLookupErrorCode =
    typeof apiCode === "string" && apiCode in MESSAGE_KEYS
      ? (apiCode as PatientLookupErrorCode)
      : classifyFromMessage(String(apiMessage));

  if (!axiosErr?.response && axiosErr?.message) {
    code = "PATIENT_LOOKUP_UNAVAILABLE";
  }
  if (httpStatus && httpStatus >= 500 && code === "PATIENT_LOOKUP_FAILED") {
    code = "PATIENT_LOOKUP_UNAVAILABLE";
  }

  return { code, message: String(apiMessage) };
};

export const getPatientLookupUserMessage = (
  error: unknown,
  t: TranslateFn
): { code: PatientLookupErrorCode; text: string; offerFirstTime: boolean } => {
  const { code } = extractPatientLookupError(error);
  const key = MESSAGE_KEYS[code] || MESSAGE_KEYS.PATIENT_LOOKUP_FAILED;
  return {
    code,
    text: t(key),
    offerFirstTime: code === "PATIENT_NOT_FOUND",
  };
};

export const extractPatientId = (patientPayload: unknown): string | null => {
  if (!patientPayload || typeof patientPayload !== "object") return null;
  const p = patientPayload as Record<string, unknown>;
  const id = p.patient_id ?? p.patientId;
  if (id === null || id === undefined || id === "") return null;
  return String(id);
};
