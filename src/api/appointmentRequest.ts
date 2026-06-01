import api from "./axiosInstance";

export type AppointmentRequestType =
  | "doctor unavailability request"
  | "first time visitor request";

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
  timeSlot?: {
    period: "morning" | "afternoon";
    time: string;
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
  const response = await api.post("/api/v1/appointment-requests", data);
  return response.data;
};
