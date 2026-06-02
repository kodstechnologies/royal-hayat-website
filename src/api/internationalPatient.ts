import api from "./axiosInstance";

export type CreateInternationalPatientEnquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address?: string;
  country?: string;
  comments?: string;
};

export const createInternationalPatientEnquiry = async (
  data: CreateInternationalPatientEnquiryPayload,
) => {
  const response = await api.post("/api/v1/international-patient-enquiries", {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    mobile: data.mobile.replace(/\D/g, "").trim(),
    address: data.address?.trim() || "",
    country: data.country?.trim() || "",
    comments: data.comments?.trim() || "",
  });
  return response.data;
};

import api from "./axiosInstance";

export type CreateInternationalPatientEnquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country?: string;
  address?: string;
  comments?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const createInternationalPatientEnquiry = async (
  data: CreateInternationalPatientEnquiryPayload,
) => {
  const response = await api.post<ApiResponse<unknown>>(
    "/api/v1/international-patient-enquiries",
    {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      mobile: data.mobile.trim(),
      country: data.country?.trim() || "",
      address: data.address?.trim() || "",
      comments: data.comments?.trim() || "",
    },
  );
  return response.data;
};
