import api from "./axiosInstance";

export type CreateAppointmentRequestPayload = {
  fullname: string;
  phone: string;
  dob?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  additionalNotes?: string;
  preferredDate: any;
  timeSlot: any;
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