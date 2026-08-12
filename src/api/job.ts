import api from "./axiosInstance";
export type JobPosting = {
  _id?: string;
  id?: string | number;
  jobId?: string;
  title: string;
  department?: string;
  category?: string;
  location?: string;
  type?: string;
  desc?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  educationAndLicensure?: string[];
  arabicEducationAndLicensure?: string[];
  professionalExperience?: string[];
  arabicProfessionalExperience?: string[];
  specializedKnowledge?: string[];
  arabicSpecializedKnowledge?: string[];
  arabicResponsibilities?: string[];
  arabicRequirements?: string[];
  arabicDescription?: string;
  arabicTitle?: string;
  arabicClassification?: string;
  arabicLocation?: string;
  classification?: string;
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
  resume?: File;
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
export type JobByIdResult = {
  available: boolean;
  job: JobPosting | null;
  message?: string;
};
export const getJobById = async (id: string): Promise<JobByIdResult> => {
  const response = await api.get(`/api/v1/jobs/${id}`);
  const body = response.data;

  if (body?.available === false) {
    return {
      available: false,
      job: null,
      message:
        body.message ?? "This job post is currently unavailable",
    };
  }

  const job =
    (body?.data ?? body?.job ?? body) as JobPosting | null;

  return {
    available: true,
    job,
  };
};
export const applyForJob = async (data: JobApplicationPayload) => {
  const formData = new FormData();
  formData.append("jobId", data.jobId);
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  if (data.coverLetter) formData.append("coverLetter", data.coverLetter);
  const resumeFile = data.cv ?? data.resume;
  if (resumeFile) formData.append("resume", resumeFile);
  const response = await api.post("/api/v1/jobs/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
