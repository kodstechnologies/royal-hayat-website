import api from "./axiosInstance";

export const APPOINTMENT_REQUEST_TYPES = {
  DOCTOR_UNAVAILABILITY: "doctor unavailability request",
  FIRST_TIME_VISITOR: "first time visitor request",
} as const;

export type AppointmentRequestType =
  (typeof APPOINTMENT_REQUEST_TYPES)[keyof typeof APPOINTMENT_REQUEST_TYPES];

export type CreateAppointmentRequestPayload = {
  fullname: string;
  fullname: string;
  phone: string;
  requestType: AppointmentRequestType;
  dob?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  additionalNotes?: string;
  preferredDate?: string;
  timeSlot?: { period?: string; time?: string; label?: string } | string;
  symptoms?: string[];
  doctor?: string;
  department?: string;
};

export type CreateAppointmentBookingRecordPayload = {
  fullname: string;
  phone: string;
  dob?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  additionalNotes?: string;
  preferredDate?: any;
  timeSlot?: any;
  doctor?: string;
  department?: string;
};

export const createAppointmentRequest = async (
  data: CreateAppointmentRequestPayload
) => {
  const response = await api.post("/api/v1/appointment-requests", data);

  return response.data;
};

export const createAppointmentBookingRecord = async (
  data: CreateAppointmentBookingRecordPayload
) => {
  const response = await api.post("/api/v1/appointment-booking-records", data);
  return response.data;
};