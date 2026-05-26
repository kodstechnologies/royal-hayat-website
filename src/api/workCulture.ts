import api from "./axiosInstance";

export type WorkCultureItem = {
  _id?: string;
  heading: string;
  headingArabic: string;
  description: string;
  descriptionArabic: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
};

export const getAllWorkCulture = async (): Promise<WorkCultureItem[]> => {
  const response = await api.get("/api/v1/work-culture");
  const data = response.data?.data;
  return Array.isArray(data) ? (data as WorkCultureItem[]) : [];
};
