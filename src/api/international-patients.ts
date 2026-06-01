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
  data: CreateInternationalPatientEnquiryPayload
) => {
  const payload = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    mobile: data.mobile.trim(),
    address: data.address?.trim() || "",
    country: data.country?.trim() || "",
    comments: data.comments?.trim() || "",
  };

  const response = await api.post(
    "/api/v1/international-patient-enquiries",
    payload
  );
  return response.data;
};
