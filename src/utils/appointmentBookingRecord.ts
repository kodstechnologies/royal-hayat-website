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
  time?: string;
  symptoms?: string[];
  slotBookingId?: string | number | null;
  verifyOperationId?: string | null;
};

export type CreateAppointmentBookingRecordPayload = {
  fullname: string;
  phone: string;
  patient_id: string;
  dob?: string;
  age?: number;
  gender?: string;
  national_id?: string;
  urn?: string;
  mobile_number?: string;
  email?: string;
  address?: string;
  englishName?: string;
  arabicName?: string;
  paciRequestId?: string;
  nationality?: string;
  passportNumber?: string;
  doctor?: string;
  department?: string;
  date?: string;
  time?: string;
  symptoms?: string[];
  additionalNotes?: string;
};

const normalizeKuwaitPhone = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("965") && digits.length >= 11) return `+${digits}`;
  if (digits.length === 8) return `+965${digits}`;
  return mobile.trim().startsWith("+") ? mobile.trim() : `+${digits}`;
};

const ageFromIsoDob = (dobIso: string): number | undefined => {
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

export const buildRegisteredPatientBookingPayload = (
  input: BuildRegisteredPatientBookingPayloadInput,
): CreateAppointmentBookingRecordPayload => {
  const phone = normalizeKuwaitPhone(input.hmsDetails?.mobile_number ?? "");
  if (!phone) {
    throw new Error("REGISTERED_PATIENT_PHONE_MISSING");
  }

  const additionalNotes: string[] = [];
  if (input.slotBookingId != null && String(input.slotBookingId).trim()) {
    additionalNotes.push(`HMS slot booking id: ${input.slotBookingId}`);
  }

  const payload: CreateAppointmentBookingRecordPayload = {
    fullname: input.patientName.trim(),
    phone,
    patient_id: String(input.patientId).trim(),
    doctor: input.doctor,
    department: input.department,
    date: input.date,
    time: input.time,
    symptoms: input.symptoms,
  };

  if (input.patientDobIso) {
    payload.dob = input.patientDobIso;
    const age = ageFromIsoDob(input.patientDobIso);
    if (age !== undefined) payload.age = age;
  }

  if (input.gender) payload.gender = input.gender;

  const nationalId =
    input.nationalId?.trim() ||
    input.hmsDetails?.national_id?.trim() ||
    input.verifiedIdentityDetails?.civilIdNumber?.trim();
  if (nationalId) payload.national_id = nationalId;

  if (input.hmsDetails?.urn?.trim()) payload.urn = input.hmsDetails.urn.trim();
  if (input.hmsDetails?.mobile_number?.trim()) {
    payload.mobile_number = input.hmsDetails.mobile_number.trim();
  }
  if (input.hmsDetails?.email?.trim()) payload.email = input.hmsDetails.email.trim();
  if (input.hmsDetails?.address?.trim()) payload.address = input.hmsDetails.address.trim();

  if (input.verifiedPersonName?.english?.trim()) {
    payload.englishName = input.verifiedPersonName.english.trim();
  }
  if (input.verifiedPersonName?.arabic?.trim()) {
    payload.arabicName = input.verifiedPersonName.arabic.trim();
  }

  if (input.verifyOperationId?.trim()) {
    payload.paciRequestId = input.verifyOperationId.trim();
  }

  if (input.verifiedIdentityDetails?.nationality?.trim()) {
    payload.nationality = input.verifiedIdentityDetails.nationality.trim();
  }
  if (input.verifiedIdentityDetails?.passportNumber?.trim()) {
    payload.passportNumber = input.verifiedIdentityDetails.passportNumber.trim();
  }

  if (additionalNotes.length > 0) {
    payload.additionalNotes = additionalNotes.join("\n");
  }

  return payload;
};
