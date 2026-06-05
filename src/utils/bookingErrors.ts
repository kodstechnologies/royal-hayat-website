export type BookingConflictCode =
  | "DUPLICATE_SAME_DOCTOR_SAME_DAY"
  | "DUPLICATE_SAME_TIME_DIFFERENT_DOCTOR";

export type BookingConflictDetails = {
  code: BookingConflictCode;
  message: string;
  existingDoctor?: string;
  existingDate?: string;
  existingTime?: string;
};

const SAME_DOCTOR_SAME_DAY_MESSAGE =
  "Patient already has an active booking with this doctor on the same day";

const cleanBookingMessage = (raw: unknown): string => {
  return String(raw || "")
    .replace(/^Error:\s*/i, "")
    .trim()
    .replace(/care provider/gi, "doctor");
};

const parseExistingBookingFromMessage = (
  message: string,
): Pick<BookingConflictDetails, "existingDoctor" | "existingDate" | "existingTime"> => {
  const appointmentDuringTimeSlot = message.match(
    /already has an appointment with\s+(.+?)\s+\((\d{1,2}:\d{2})(?:\s*-\s*\d{1,2}:\d{2})?\)\s+during this time slot/i,
  );
  if (appointmentDuringTimeSlot) {
    return {
      existingDoctor: appointmentDuringTimeSlot[1]?.trim(),
      existingTime: appointmentDuringTimeSlot[2]?.trim(),
    };
  }

  const withProviderOnDateAtTime = message.match(
    /with\s+(?:doctor\s+|care\s+provider\s+)?(.+?)\s+on\s+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\s+(?:at\s+)?(\d{1,2}:\d{2}(?::\d{2})?)/i,
  );
  if (withProviderOnDateAtTime) {
    return {
      existingDoctor: withProviderOnDateAtTime[1]?.trim(),
      existingDate: withProviderOnDateAtTime[2]?.trim(),
      existingTime: withProviderOnDateAtTime[3]?.trim(),
    };
  }

  const onDateAtTimeWith = message.match(
    /on\s+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\s+at\s+(\d{1,2}:\d{2}(?::\d{2})?)\s+with\s+(.+?)(?:\.|$)/i,
  );
  if (onDateAtTimeWith) {
    return {
      existingDate: onDateAtTimeWith[1]?.trim(),
      existingTime: onDateAtTimeWith[2]?.trim(),
      existingDoctor: onDateAtTimeWith[3]?.trim(),
    };
  }

  const doctorOnly = message.match(
    /(?:doctor|care\s+provider)\s+(.+?)(?:\s+on\s+|\s+at\s+|\.|$)/i,
  );
  if (doctorOnly) {
    return { existingDoctor: doctorOnly[1]?.trim() };
  }

  return {};
};

const isDuplicateBookingHint = (lower: string): boolean =>
  lower.includes("active booking") ||
  lower.includes("already has an appointment") ||
  lower.includes("already has a booking") ||
  lower.includes("during this time slot") ||
  lower.includes("book at a different date or time") ||
  (lower.includes("already has") &&
    (lower.includes("booking") || lower.includes("appointment")));

const isSameDoctorSameDayHint = (lower: string): boolean =>
  (lower.includes("same doctor") && lower.includes("same day")) ||
  (lower.includes("this doctor") && lower.includes("same day"));

const isSameTimeConflictHint = (
  lower: string,
  parsed: Pick<BookingConflictDetails, "existingDoctor" | "existingDate" | "existingTime">,
): boolean =>
  lower.includes("same time") ||
  lower.includes("same day and time") ||
  lower.includes("during this time slot") ||
  lower.includes("book at a different date or time") ||
  Boolean(parsed.existingDoctor && (parsed.existingDate || parsed.existingTime));

export const classifyBookingConflict = (raw: unknown): BookingConflictDetails | null => {
  const message = cleanBookingMessage(raw);
  if (!message) return null;

  const lower = message.toLowerCase();
  const parsed = parseExistingBookingFromMessage(message);

  if (
    lower === SAME_DOCTOR_SAME_DAY_MESSAGE.toLowerCase() ||
    isSameDoctorSameDayHint(lower)
  ) {
    return {
      code: "DUPLICATE_SAME_DOCTOR_SAME_DAY",
      message:
        lower === SAME_DOCTOR_SAME_DAY_MESSAGE.toLowerCase()
          ? SAME_DOCTOR_SAME_DAY_MESSAGE
          : message,
      ...parsed,
    };
  }

  if (!isDuplicateBookingHint(lower)) {
    if (parsed.existingDoctor && parsed.existingDate && parsed.existingTime) {
      return {
        code: "DUPLICATE_SAME_TIME_DIFFERENT_DOCTOR",
        message,
        ...parsed,
      };
    }
    return null;
  }

  if (isSameTimeConflictHint(lower, parsed)) {
    return {
      code: "DUPLICATE_SAME_TIME_DIFFERENT_DOCTOR",
      message,
      ...parsed,
    };
  }

  return null;
};

export const resolveBookingConflict = (
  raw: unknown,
  apiMeta?: {
    conflict?: BookingConflictDetails | null;
    code?: string;
    status?: string;
  } | null,
): BookingConflictDetails | null => {
  if (apiMeta?.conflict?.code) {
    return apiMeta.conflict;
  }

  const metaCode = apiMeta?.code;
  if (
    metaCode === "DUPLICATE_SAME_DOCTOR_SAME_DAY" ||
    metaCode === "DUPLICATE_SAME_TIME_DIFFERENT_DOCTOR"
  ) {
    const message =
      cleanBookingMessage(raw) || cleanBookingMessage(apiMeta?.status) || "";
    return {
      code: metaCode,
      message:
        metaCode === "DUPLICATE_SAME_DOCTOR_SAME_DAY" && !message
          ? SAME_DOCTOR_SAME_DAY_MESSAGE
          : message,
      ...parseExistingBookingFromMessage(message),
    };
  }

  return (
    classifyBookingConflict(raw) ||
    classifyBookingConflict(apiMeta?.status) ||
    null
  );
};

export const formatBookingConflictAlert = (
  conflict: BookingConflictDetails,
  isAr: boolean,
  fallback?: { doctorName?: string; date?: string; time?: string },
): string => {
  if (conflict.code === "DUPLICATE_SAME_DOCTOR_SAME_DAY") {
    return isAr
      ? "لديك موعد محجوز مسبقاً مع نفس الطبيب في نفس اليوم."
      : conflict.message || SAME_DOCTOR_SAME_DAY_MESSAGE;
  }

  const doctor = conflict.existingDoctor || fallback?.doctorName;
  const date = conflict.existingDate || fallback?.date;
  const time = conflict.existingTime || fallback?.time;

  if (doctor && date && time) {
    return isAr
      ? `لديك موعد محجوز مسبقاً مع ${doctor} بتاريخ ${date} الساعة ${time}.`
      : `You already have an appointment with ${doctor} on ${date} at ${time}.`;
  }

  if (doctor && date) {
    return isAr
      ? `لديك موعد محجوز مسبقاً مع ${doctor} بتاريخ ${date}.`
      : `You already have an appointment with ${doctor} on ${date}.`;
  }

  if (doctor && time) {
    const dateSuffix = date ? (isAr ? ` بتاريخ ${date}` : ` on ${date}`) : "";
    return isAr
      ? `لديك موعد محجوز مسبقاً مع ${doctor}${dateSuffix} الساعة ${time}.`
      : `You already have an appointment with ${doctor}${dateSuffix} at ${time}.`;
  }

  return isAr
    ? "لديك موعد محجوز مسبقاً في نفس التاريخ والوقت."
    : conflict.message || "You already have an appointment at the same date and time.";
};

export const isAlertOnlyBookingConflict = (
  raw: unknown,
  apiMeta?: {
    conflict?: BookingConflictDetails | null;
    code?: string;
    status?: string;
  } | null,
): boolean => resolveBookingConflict(raw, apiMeta) !== null;
