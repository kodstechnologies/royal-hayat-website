import api from "./axiosInstance";

export type JobPosting = {
  _id?: string;
  id?: string | number;
  jobId?: string;
  title: string;
  /** Backend field used for grouping (maps to "category" in UI). */
  department?: string;
  category?: string;
  location?: string;
  type?: string;
  desc?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
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
  cv?: File;
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

export const applyForJob = async (data: JobApplicationPayload) => {
  const formData = new FormData();
  formData.append("jobId", data.jobId);
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  if (data.coverLetter) formData.append("coverLetter", data.coverLetter);
  if (data.cv) formData.append("cv", data.cv);

  const response = await api.post("/api/v1/jobs/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
