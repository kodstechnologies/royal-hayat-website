import api from "./axiosInstance";

export type CreateAppointmentRequestPayload = {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  preferredDate: string;
  timeSlot: {
    period: "morning" | "afternoon";
    time: string;
  };
  additionalNotes?: string;
};

export const createAppointmentRequest = async (data: CreateAppointmentRequestPayload) => {
  const response = await api.post("/api/v1/appointment-requests", data);
  return response.data;
};
