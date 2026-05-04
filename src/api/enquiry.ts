import api from "./axiosInstance";

type EnquiryPayload = {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  message: string;
};

export const postEnquiry = async (data: EnquiryPayload) => {
  const payload = {
    name: data.fullName,
    email: data.email,
    phone: data.phone,
    department: data.department || "General Inquiry",
    message: data.message,
  };

  const response = await api.post("/api/v1/enquiries", payload);
  return response.data;
};
