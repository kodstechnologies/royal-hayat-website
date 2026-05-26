import api from "./axiosInstance";

export type LeadershipItem = {
  _id?: string;
  initials: string;
  initialsArabic: string;
  name: string;
  nameArabic: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getAllLeadership = async (): Promise<LeadershipItem[]> => {
  const response = await api.get("/api/v1/leadership");
  const data = response.data?.data;
  return Array.isArray(data) ? (data as LeadershipItem[]) : [];
};

export const descriptionToParagraphs = (text: string): string[] => {
  const byBlankLine = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (byBlankLine.length > 1) return byBlankLine;
  const byLine = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return byLine.length > 0 ? byLine : [text.trim()].filter(Boolean);
};
