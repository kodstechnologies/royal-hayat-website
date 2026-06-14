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

export type WorkCultureSectionDisplay = {
  key: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  images: string[];
};

export const mapWorkCultureToDisplay = (
  item: WorkCultureItem,
): WorkCultureSectionDisplay => ({
  key: item._id ?? item.heading,
  titleEn: item.heading,
  titleAr: item.headingArabic,
  subtitleEn: item.description,
  subtitleAr: item.descriptionArabic,
  images: item.images ?? [],
});

export const getAllWorkCulture = async (): Promise<WorkCultureItem[]> => {
  const response = await api.get("/api/v1/work-culture");
  const data = response.data?.data;
  return Array.isArray(data) ? (data as WorkCultureItem[]) : [];
};
