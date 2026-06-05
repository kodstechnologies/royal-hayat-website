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

const SAME_DOCTOR_SAME_DAY_MESSAGE_AR =
  "المريض لديه موعد محجوز مسبقاً مع نفس الطبيب في نفس اليوم";

const cleanBookingMessage = (raw: unknown): string => {
  return String(raw || "")
    .replace(/^Error:\s*/i, "")
    .trim()
    .replace(/care provider/gi, "doctor");
};

const formatTimeRange = (start?: string, end?: string): string | undefined => {
  if (!start) return undefined;
  return end ? `${start}-${end}` : start;
};

const parseExistingBookingFromMessage = (
  message: string,
): Pick<BookingConflictDetails, "existingDoctor" | "existingDate" | "existingTime"> => {
  const arabicAppointmentDuringTimeSlot = message.match(
    /موعد\s+مع\s+\(([^)]+)\)[،,]?\s*خلال\s+هذا\s+الوقت\s+\((\d{1,2}:\d{2})(?:\s*-\s*(\d{1,2}:\d{2}))?\)/u,
  );
  if (arabicAppointmentDuringTimeSlot) {
    return {
      existingDoctor: arabicAppointmentDuringTimeSlot[1]?.trim(),
      existingTime: formatTimeRange(
        arabicAppointmentDuringTimeSlot[2]?.trim(),
        arabicAppointmentDuringTimeSlot[3]?.trim(),
      ),
    };
  }

  const appointmentDuringTimeSlot = message.match(
    /already has an appointment with\s+(.+?)\s+\((\d{1,2}:\d{2})(?:\s*-\s*(\d{1,2}:\d{2})?)\)\s+during this time slot/i,
  );
  if (appointmentDuringTimeSlot) {
    return {
      existingDoctor: appointmentDuringTimeSlot[1]?.trim(),
      existingTime: formatTimeRange(
        appointmentDuringTimeSlot[2]?.trim(),
        appointmentDuringTimeSlot[3]?.trim(),
      ),
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

const isDuplicateBookingHint = (message: string, lower: string): boolean =>
  lower.includes("active booking") ||
  lower.includes("already has an appointment") ||
  lower.includes("already has a booking") ||
  lower.includes("during this time slot") ||
  lower.includes("book at a different date or time") ||
  (lower.includes("already has") &&
    (lower.includes("booking") || lower.includes("appointment"))) ||
  message.includes("لديه موعد") ||
  message.includes("لدي موعد") ||
  message.includes("خلال هذا الوقت") ||
  message.includes("يرجى الحجز في تاريخ أو وقت مختلف");

const isSameDoctorSameDayHint = (message: string, lower: string): boolean =>
  (lower.includes("same doctor") && lower.includes("same day")) ||
  (lower.includes("this doctor") && lower.includes("same day")) ||
  (message.includes("نفس الطبيب") && message.includes("نفس اليوم"));

const isSameTimeConflictHint = (
  message: string,
  lower: string,
  parsed: Pick<BookingConflictDetails, "existingDoctor" | "existingDate" | "existingTime">,
): boolean =>
  lower.includes("same time") ||
  lower.includes("same day and time") ||
  lower.includes("during this time slot") ||
  lower.includes("book at a different date or time") ||
  message.includes("خلال هذا الوقت") ||
  message.includes("يرجى الحجز في تاريخ أو وقت مختلف") ||
  Boolean(parsed.existingDoctor && (parsed.existingDate || parsed.existingTime));

const formatArabicDoctorLabel = (doctor: string): string =>
  doctor.startsWith("د.") || doctor.startsWith("د ") ? doctor : `د. ${doctor}`;

const formatEnglishTimeSlotConflict = (doctor: string, time: string): string =>
  `Patient already has an appointment with ${doctor} (${time}) during this time slot. Please book at a different date or time`;

const formatArabicTimeSlotConflict = (doctor: string, time: string): string =>
  `المريض لديه موعد مع (${formatArabicDoctorLabel(doctor)})، خلال هذا الوقت (${time}). يرجى الحجز في تاريخ أو وقت مختلف`;

export const classifyBookingConflict = (raw: unknown): BookingConflictDetails | null => {
  const message = cleanBookingMessage(raw);
  if (!message) return null;

  const lower = message.toLowerCase();
  const parsed = parseExistingBookingFromMessage(message);

  if (
    lower === SAME_DOCTOR_SAME_DAY_MESSAGE.toLowerCase() ||
    isSameDoctorSameDayHint(message, lower)
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

  if (!isDuplicateBookingHint(message, lower)) {
    if (parsed.existingDoctor && parsed.existingDate && parsed.existingTime) {
      return {
        code: "DUPLICATE_SAME_TIME_DIFFERENT_DOCTOR",
        message,
        ...parsed,
      };
    }
    return null;
  }

  if (isSameTimeConflictHint(message, lower, parsed)) {
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
    return isAr ? SAME_DOCTOR_SAME_DAY_MESSAGE_AR : conflict.message || SAME_DOCTOR_SAME_DAY_MESSAGE;
  }

  const doctor = conflict.existingDoctor || fallback?.doctorName;
  const date = conflict.existingDate || fallback?.date;
  const time = conflict.existingTime || fallback?.time;

  if (doctor && time) {
    return isAr
      ? formatArabicTimeSlotConflict(doctor, time)
      : formatEnglishTimeSlotConflict(doctor, time);
  }

  if (doctor && date && time) {
    return isAr
      ? `لديك موعد محجوز مسبقاً مع ${formatArabicDoctorLabel(doctor)} بتاريخ ${date} الساعة ${time}.`
      : `You already have an appointment with ${doctor} on ${date} at ${time}.`;
  }

  if (doctor && date) {
    return isAr
      ? `لديك موعد محجوز مسبقاً مع ${formatArabicDoctorLabel(doctor)} بتاريخ ${date}.`
      : `You already have an appointment with ${doctor} on ${date}.`;
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
