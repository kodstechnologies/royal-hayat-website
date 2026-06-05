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

export const classifyBookingConflict = (raw: unknown): BookingConflictDetails | null => {
  const message = cleanBookingMessage(raw);
  if (!message) return null;

  const lower = message.toLowerCase();
  if (lower === SAME_DOCTOR_SAME_DAY_MESSAGE.toLowerCase()) {
    return {
      code: "DUPLICATE_SAME_DOCTOR_SAME_DAY",
      message: SAME_DOCTOR_SAME_DAY_MESSAGE,
    };
  }

  if (!lower.includes("active booking")) {
    return null;
  }

  const parsed = parseExistingBookingFromMessage(message);
  const isSameDoctorSameDay =
    lower.includes("same doctor") && lower.includes("same day");

  if (isSameDoctorSameDay) {
    return {
      code: "DUPLICATE_SAME_DOCTOR_SAME_DAY",
      message,
      ...parsed,
    };
  }

  const isSameTimeConflict =
    lower.includes("same time") ||
    lower.includes("same day and time") ||
    Boolean(parsed.existingDoctor && (parsed.existingDate || parsed.existingTime));

  if (isSameTimeConflict) {
    return {
      code: "DUPLICATE_SAME_TIME_DIFFERENT_DOCTOR",
      message,
      ...parsed,
    };
  }

  return null;
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

  return isAr
    ? "لديك موعد محجوز مسبقاً في نفس التاريخ والوقت."
    : conflict.message || "You already have an appointment at the same date and time.";
};

export const isAlertOnlyBookingConflict = (raw: unknown): boolean =>
  classifyBookingConflict(raw) !== null;
