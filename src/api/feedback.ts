import api from "./axiosInstance";


// ================= HOSPITAL FEEDBACK =================

export type CreateHospitalFeedbackPayload = {
  userName?: string;
  arabicUserName?: string;
  feedback?: string;
  arabicFeedback?: string;
  stars: number;
};

export type HospitalFeedbackRecord = {
  _id: string;
  userName?: string;
  arabicUserName?: string;
  feedback?: string;
  arabicFeedback?: string;
  stars: number;
  shownOnWebsite?: boolean;
  addedBy?: string;
  createdAt?: string;
};

export const createHospitalFeedback = async (
  data: CreateHospitalFeedbackPayload,
  options?: { addedBy?: "patient" | "admin" }
) => {
  const query = new URLSearchParams();
  if (options?.addedBy) query.append("addedBy", options.addedBy);
  const qs = query.toString();

  const response = await api.post(
    `/api/v1/hospital-feedback/create${qs ? `?${qs}` : ""}`,
    data
  );

  return response.data;
};

/** Fetch all hospital feedbacks (GET /api/v1/hospital-feedback/all). */
export const getAllHospitalFeedbacks = async () => {
  const response = await api.get("/api/v1/hospital-feedback/all");
  return response.data;
};


// ================= DOCTOR FEEDBACK =================

export type DoctorFeedbackRecord = {
  _id: string;
  userName?: string;
  arabicUserName?: string;
  feedback?: string;
  arabicFeedback?: string;
  stars: number;
  shownOnWebsite?: boolean;
  addedBy?: string;
  createdAt?: string;
  doctor?: string | { _id?: string; doctorId?: string };
};

export type CreateDoctorFeedbackPayload = {
  doctorId: string;
  stars: number;
  userName?: string;
  arabicUserName?: string;
  feedback?: string;
  arabicFeedback?: string;
  shownOnWebsite?: boolean;
};

export const createDoctorFeedback = async (
  data: CreateDoctorFeedbackPayload,
  options?: { addedBy?: "patient" | "admin"; language?: string }
) => {
  const query = new URLSearchParams();
  if (options?.addedBy) query.append("addedBy", options.addedBy);
  if (options?.language) query.append("language", options.language);

  const qs = query.toString();
  const response = await api.post(
    `/api/v1/doctor-feedback/create${qs ? `?${qs}` : ""}`,
    data
  );

  return response.data;
};

/** Fetch all doctor feedbacks (GET /api/v1/doctor-feedback/all). */
export const getAllDoctorFeedbacks = async () => {
  const response = await api.get("/api/v1/doctor-feedback/all");
  return response.data;
};

/** Fetch all feedback for a doctor by business doctorId (or legacy Mongo doctor _id). */
export const getDoctorFeedbacksByDoctorId = async (doctorId: string) => {
  const response = await api.get(
    `/api/v1/doctor-feedback/${encodeURIComponent(doctorId)}`
  );

  return response.data;
};
