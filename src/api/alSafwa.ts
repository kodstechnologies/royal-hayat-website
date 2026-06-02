import api from "./axiosInstance";

export type CreateAlSafwaPayload = {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  notes: string;
};

export const createAlSafwaEnrollment = async (data: CreateAlSafwaPayload) => {
  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    age: String(data.age).trim(),
    gender: data.gender.trim(),
    notes: data.notes.trim(),
  };

  const response = await api.post("/api/v1/al-safwa", payload);
  return response.data;
};
