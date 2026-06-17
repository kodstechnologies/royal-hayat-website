import api from "./axiosInstance";
export type AppointmentRequestType =
  | "doctor unavailability request"
  | "first time visitor request"
  | "appointment request"
  | "registered patient booking fallback";

export type CreateAppointmentRequestPayload = {
  fullname: string;
  phone: string;
  gender: string;
  requestType: AppointmentRequestType;
  dateOfBirth?: string;
  dob?: string;
  age?: number;
  preferredDate?: string;
  date?: string;
  slot_from_time?: string;
  slot_to_time?: string;
  timeSlot?: {
    period: "morning" | "afternoon";
    slot_from_time?: string;
    slot_to_time?: string;
    time?: string;
  };
  time?: string;
  additionalNotes?: string;
  doctor?: string;
  department?: string;
  symptoms?: string[];
  email?: string;
};
export const createAppointmentRequest = async (
  data: CreateAppointmentRequestPayload,
) => {
  console.log("data", data);
  const response = await api.post("/api/v1/appointment-requests", data);
  console.log("response", response);
  return response.data;
};
