import api from "./axiosInstance";

const BASE = "/api/v1/events";

export type CreateEventBookingPayload = {
  hall: "gardenia" | "aljouri" | "in-room-event-services";
  dueDateOfExpectingMother: string;
  eventType: "birth" | "workshop" | "social" | "other";
  otherEventType?: string;
  proposedDate: string;
  numberOfDays: number;
  name: string;
  mobileNumber: string;
  email: string;
  mrn?: string;
};

export const createEventBooking = async (payload: CreateEventBookingPayload) => {
  const response = await api.post(BASE, payload);
  return response.data;
};
