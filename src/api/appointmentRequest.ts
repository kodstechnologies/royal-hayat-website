import api from "./axiosInstance";

export type CreateAppointmentRequestPayload = {
  fullname: string;
  phone: string;
  dateOfBirth?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  additionalNotes?: string;
  preferredDate:any
  timeSlot:any
};

export const createAppointmentRequest = async (
  data: CreateAppointmentRequestPayload
) => {

  console.log("payload", data);

  const response = await api.post(
    "/api/v1/appointment-requests",
    data
  );

  return response.data;
};