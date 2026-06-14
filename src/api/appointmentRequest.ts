import api from "./axiosInstance";
export type AppointmentRequestType =
  | "doctor unavailability request"
  | "first time visitor request"
  | "appointment request"
  | "registered patient booking fallback";

export type CreateAppointmentRequestPayload = {
  fullname: string;
  // fullname: string;
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
  console.log("data", data);
  const response = await api.post("/api/v1/appointment-requests", data);
  console.log("response", response);
  return response.data;
};

export const createAppointmentBookingRecord = async (
  data: CreateAppointmentBookingRecordPayload
) => {
  const response = await api.post("/api/v1/appointment-booking-records", data);
  return response.data;
};