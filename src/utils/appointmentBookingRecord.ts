import { identityDateToIso } from "@/utils/mapPaciGender";

export type RegisteredPatientHmsDetails = {
  mobile_number: string;
  urn: string;
  email: string;
  address: string;
  national_id: string;
};

type VerifiedIdentityDetails = {
  name: string;
  dateOfBirth: string;
  civilIdNumber: string;
  nationality: string;
  gender: string;
  passportNumber: string;
};

export type CreateAppointmentBookingRecordPayload = {
  fullname: string;
  phone: string;
  age?: number;
  gender?: string;
  dob?: string;
  patient_id?: string;
  urn?: string;
  national_id?: string;
  mobile_number?: string;
  email?: string;
  address?: string;
  englishName?: string;
  arabicName?: string;
  paciRequestId?: string;
  date?: string;
  slot_from_time?: string;
  slot_to_time?: string;
  nationality?: string;
  passportNumber?: string;
  symptoms?: string[];
  doctor?: string;
  department?: string;
};

type BuildRegisteredPatientBookingPayloadInput = {
  patientName: string;
  patientId: string;
  patientDobIso?: string;
  gender?: string;
  nationalId?: string;
  verifiedIdentityDetails?: VerifiedIdentityDetails | null;
  verifiedPersonName?: { english: string; arabic: string } | null;
  hmsDetails?: RegisteredPatientHmsDetails | null;
  doctor?: string;
  department?: string;
  date?: string;
  slot_from_time?: string;
  slot_to_time?: string;
  symptoms?: string[];
  slotBookingId?: string | null;
  verifyOperationId?: string | null;
};

const calculateAge = (dobIso: string): number | undefined => {
  const dob = new Date(dobIso);
  if (Number.isNaN(dob.getTime())) return undefined;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : undefined;
};

const normalizeRegisteredPatientPhone = (raw?: string): string => {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("965") && digits.length >= 11) return `+${digits}`;
  if (digits.length === 8) return `+965${digits}`;
  if (digits.length > 8) return `+${digits}`;
  return "";
};

export const buildRegisteredPatientBookingPayload = (
  input: BuildRegisteredPatientBookingPayloadInput,
): CreateAppointmentBookingRecordPayload => {
  const phone = normalizeRegisteredPatientPhone(input.hmsDetails?.mobile_number);
  if (!phone) {
    throw new Error("REGISTERED_PATIENT_PHONE_MISSING");
  }

  const dob =
    input.patientDobIso ||
    identityDateToIso(input.verifiedIdentityDetails?.dateOfBirth) ||
    undefined;

  const payload: CreateAppointmentBookingRecordPayload = {
    fullname: input.patientName.trim(),
    phone,
    patient_id: input.patientId,
    gender: input.gender || undefined,
    dob,
    age: dob ? calculateAge(dob) : undefined,
    national_id:
      input.hmsDetails?.national_id ||
      input.nationalId ||
      input.verifiedIdentityDetails?.civilIdNumber ||
      undefined,
    urn: input.hmsDetails?.urn || undefined,
    mobile_number: input.hmsDetails?.mobile_number || undefined,
    email: input.hmsDetails?.email || undefined,
    address: input.hmsDetails?.address || undefined,
    englishName: input.verifiedPersonName?.english || undefined,
    arabicName: input.verifiedPersonName?.arabic || undefined,
    paciRequestId: input.verifyOperationId || undefined,
    nationality: input.verifiedIdentityDetails?.nationality || undefined,
    passportNumber: input.verifiedIdentityDetails?.passportNumber || undefined,
    doctor: input.doctor,
    department: input.department,
    date: input.date,
    slot_from_time: input.slot_from_time,
    slot_to_time: input.slot_to_time,
    symptoms: input.symptoms,
  };

  return payload;
};
