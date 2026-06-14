import api from "./axiosInstance";

export type CreateAppointmentBookingRecordPayload = {
  fullname: string;
  phone: string;
  gender?: string;
  age?: number;
  additionalNotes?: string;
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
  time?: string;
  nationality?: string;
  passportNumber?: string;
  symptoms?: string[];
  doctor?: string;
  department?: string;
  patient?: Record<string, unknown>;
  raw?: Record<string, unknown>;
};

export const createAppointmentBookingRecord = async (
  data: CreateAppointmentBookingRecordPayload,
) => {
  const response = await api.post("/api/v1/appointment-booking-records", data);
  return response.data;
};
