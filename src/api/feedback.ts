import api from "./axiosInstance";


// ================= HOSPITAL FEEDBACK =================

export type CreateHospitalFeedbackPayload = {
  userName?: string;
  arabicUserName?: string;
  feedback?: string;
  arabicFeedback?: string;
  stars: number;
  shownOnWebsite?: boolean;
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

export type CreateHospitalFeedbackResponse = {
  success?: boolean;
  message?: string;
  data?: HospitalFeedbackRecord;
};

export const extractHospitalFeedbackRecord = (
  res: unknown,
): HospitalFeedbackRecord | null => {
  if (!res || typeof res !== "object") return null;
  const wrapped = res as CreateHospitalFeedbackResponse & HospitalFeedbackRecord;
  if (wrapped.data && typeof wrapped.data === "object") {
    return wrapped.data;
  }
  if (wrapped._id || (wrapped as { id?: string }).id) {
    return wrapped as HospitalFeedbackRecord;
  }
  return null;
};

export const createHospitalFeedback = async (
  data: CreateHospitalFeedbackPayload,
  options?: { addedBy?: "patient" | "admin" }
): Promise<CreateHospitalFeedbackResponse> => {
  const query = new URLSearchParams();
  if (options?.addedBy) query.append("addedBy", options.addedBy);
  const qs = query.toString();

  const response = await api.post<CreateHospitalFeedbackResponse>(
    `/api/v1/hospital-feedback/create${qs ? `?${qs}` : ""}`,
    data,
  );

  return response.data;
};


export const normalizeHospitalFeedbackList = (
  res: unknown,
): HospitalFeedbackRecord[] => {
  if (Array.isArray(res)) return res as HospitalFeedbackRecord[];
  if (!res || typeof res !== "object") return [];
  const obj = res as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data as HospitalFeedbackRecord[];
  return [];
};

/** Fetch all hospital feedbacks (GET /api/v1/hospital-feedback/all). */
export const getAllHospitalFeedbacks = async (): Promise<
  HospitalFeedbackRecord[]
> => {
  const response = await api.get("/api/v1/hospital-feedback/all");
  return normalizeHospitalFeedbackList(response.data);
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
