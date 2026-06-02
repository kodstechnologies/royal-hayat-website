import api from "./axiosInstance";

export type JobPosting = {
  _id?: string;
  id?: string | number;
  jobId?: string;
  title: string;
  arabicTitle?: string;
  /** Backend field used for grouping (maps to "category" in UI). */
  department?: string;
  category?: string;
  classification?: string;
  location?: string;
  arabicLocation?: string;
  type?: string;
  desc?: string;
  description?: string;
  arabicDescription?: string;
  responsibilities?: string[];
  arabicResponsibilities?: string[];
  requirements?: string[];
  arabicRequirements?: string[];
  postedDate?: string;
  date?: string;
  isActive?: boolean;
  [key: string]: unknown;
};

export type JobApplicationPayload = {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resume: File;
};

export type GetJobsParams = {
  page?: number;
  limit?: number;
  isActive?: boolean;
};

export const getAllJobs = async (params?: GetJobsParams) => {
  const response = await api.get("/api/v1/jobs", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 100,
      ...(params?.isActive !== undefined ? { isActive: params.isActive } : { isActive: true }),
    },
  });
  const data = response.data?.data;
  return Array.isArray(data) ? (data as JobPosting[]) : [];
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/api/v1/jobs/${id}`);
  return response.data?.data ?? response.data?.job ?? response.data;
};

/** POST /api/v1/job-applications — multipart: jobId, fullName, email, phone, resume, coverLetter? */
export const applyForJob = async (data: JobApplicationPayload) => {
  const formData = new FormData();
  formData.append("jobId", data.jobId);
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("resume", data.resume);
  if (data.coverLetter) formData.append("coverLetter", data.coverLetter);

  const response = await api.post("/api/v1/job-applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
