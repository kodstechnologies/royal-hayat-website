import type { CreateAppointmentBookingRecordPayload } from "@/api/appointmentBookingRecord";

export type RegisteredPatientHmsDetails = {
  mobile_number?: string;
  urn?: string;
  email?: string;
  address?: string;
  national_id?: string;
};

export const formatKuwaitPhone = (mobile?: string): string => {
  const digits = String(mobile || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("965") && digits.length >= 11) return `+${digits}`;
  if (digits.length === 8) return `+965${digits}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
};

export const buildRegisteredPatientBookingPayload = (input: {
  patientName: string;
  patientId: string;
  patientDobIso?: string;
  gender?: string;
  nationalId?: string;
  verifiedIdentityDetails?: {
    civilIdNumber?: string;
    nationality?: string;
    passportNumber?: string;
  } | null;
  verifiedPersonName?: { english: string; arabic: string } | null;
  hmsDetails?: RegisteredPatientHmsDetails | null;
  doctor?: string;
  department?: string;
  date?: string;
  time?: string;
  symptoms?: string[];
  slotBookingId?: string | null;
  verifyOperationId?: string | null;
}): CreateAppointmentBookingRecordPayload => {
  const phone = formatKuwaitPhone(input.hmsDetails?.mobile_number);
  if (!phone) {
    throw new Error("REGISTERED_PATIENT_PHONE_MISSING");
  }

  const civilId =
    input.verifiedIdentityDetails?.civilIdNumber?.replace(/—/g, "").trim() ||
    input.hmsDetails?.national_id?.trim() ||
    input.nationalId?.trim() ||
    undefined;

  const passport = input.verifiedIdentityDetails?.passportNumber?.trim();
  const notes: string[] = [];
  if (input.slotBookingId) notes.push(`HMS slot booking id: ${input.slotBookingId}`);
  if (input.patientId) notes.push(`HIS patient id: ${input.patientId}`);

  return {
    fullname: input.patientName.trim(),
    phone,
    gender: input.gender || undefined,
    dob: input.patientDobIso || undefined,
    patient_id: input.patientId,
    urn: input.hmsDetails?.urn?.trim() || undefined,
    national_id: civilId,
    mobile_number: input.hmsDetails?.mobile_number?.trim() || undefined,
    email: input.hmsDetails?.email?.trim() || undefined,
    address: input.hmsDetails?.address?.trim() || undefined,
    englishName: input.verifiedPersonName?.english?.trim() || undefined,
    arabicName: input.verifiedPersonName?.arabic?.trim() || undefined,
    paciRequestId: input.verifyOperationId?.trim() || undefined,
    date: input.date?.trim() || undefined,
    time: input.time?.trim() || undefined,
    nationality: input.verifiedIdentityDetails?.nationality?.trim() || undefined,
    passportNumber: passport && passport !== "—" ? passport : undefined,
    symptoms: input.symptoms?.length ? input.symptoms : undefined,
    doctor: input.doctor?.trim() || undefined,
    department: input.department?.trim() || undefined,
    additionalNotes: notes.length ? notes.join(". ") : undefined,
  };
};
