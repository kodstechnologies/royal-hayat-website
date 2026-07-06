import api from "./axiosInstance";
import type { PatientTestimonial } from "@/data/patientTestimonials";


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

export function mapHospitalFeedbackToTestimonial(
  record: HospitalFeedbackRecord,
): PatientTestimonial {
  return {
    name: String(record.userName ?? "").trim(),
    nameAr: String(record.arabicUserName ?? "").trim(),
    text: String(record.feedback ?? "").trim(),
    textAr: String(record.arabicFeedback ?? "").trim(),
    stars: record.stars,
  };
}

// ================= DOCTOR FEEDBACK =================

export type CreateDoctorFeedbackPayload = {
  doctorName: string;
  userName?: string;
  arabicUserName?: string;
  feedback?: string;
  arabicFeedback?: string;
  stars: number;
  shownOnWebsite?: boolean;
};

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
  doctor?: string | { _id?: string; name?: string; nameAr?: string };
};

export type CreateDoctorFeedbackResponse = {
  success?: boolean;
  message?: string;
  data?: DoctorFeedbackRecord;
};

export const extractDoctorFeedbackRecord = (
  res: unknown,
): DoctorFeedbackRecord | null => {
  if (!res || typeof res !== "object") return null;
  const wrapped = res as CreateDoctorFeedbackResponse & DoctorFeedbackRecord;
  if (wrapped.data && typeof wrapped.data === "object") {
    return wrapped.data;
  }
  if (wrapped._id || (wrapped as { id?: string }).id) {
    return wrapped as DoctorFeedbackRecord;
  }
  return null;
};

export const normalizeDoctorFeedbackList = (
  res: unknown,
): DoctorFeedbackRecord[] => {
  if (Array.isArray(res)) return res as DoctorFeedbackRecord[];
  if (!res || typeof res !== "object") return [];
  const obj = res as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data as DoctorFeedbackRecord[];
  return [];
};

/** Create doctor feedback by doctor name (POST /api/v1/doctor-feedback/create/by-name). */
export const createDoctorFeedbackByName = async (
  data: CreateDoctorFeedbackPayload,
  options?: { addedBy?: "patient" | "admin" },
): Promise<CreateDoctorFeedbackResponse> => {
  const query = new URLSearchParams();
  if (options?.addedBy) query.append("addedBy", options.addedBy);
  const qs = query.toString();

  const response = await api.post<CreateDoctorFeedbackResponse>(
    `/api/v1/doctor-feedback/create/by-name${qs ? `?${qs}` : ""}`,
    data,
  );

  return response.data;
};

/** Fetch doctor feedbacks by doctor name (GET /api/v1/doctor-feedback/by-name). */
export const getDoctorFeedbacksByDoctorName = async (
  doctorName: string,
): Promise<DoctorFeedbackRecord[]> => {
  const query = new URLSearchParams({ doctorName });
  const response = await api.get(
    `/api/v1/doctor-feedback/by-name?${query.toString()}`,
  );
  return normalizeDoctorFeedbackList(response.data);
};
