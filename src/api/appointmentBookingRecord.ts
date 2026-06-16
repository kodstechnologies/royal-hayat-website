import api from "./axiosInstance";
import type { CreateAppointmentBookingRecordPayload } from "@/utils/appointmentBookingRecord";

export const createAppointmentBookingRecord = async (
  data: CreateAppointmentBookingRecordPayload,
) => {
  const response = await api.post("/api/v1/appointment-booking-records", data);
  return response.data;
};
