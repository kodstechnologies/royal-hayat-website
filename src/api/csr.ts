import api from "./axiosInstance";

export type CSRItem = {
  _id?: string;
  heading: string;
  headingArabic: string;
  subheading?: string;
  subheadingArabic?: string;
  description: string;
  descriptionArabic: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
};

export const getAllCSR = async (): Promise<CSRItem[]> => {
  const response = await api.get("/api/v1/csr");
  const data = response.data?.data;
  return Array.isArray(data) ? (data as CSRItem[]) : [];
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
