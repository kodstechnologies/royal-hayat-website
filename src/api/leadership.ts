import api from "./axiosInstance";

export type LeadershipItem = {
  _id?: string;
  initials: string;
  initialsArabic: string;
  name: string;
  nameArabic: string;
  title: string;
  titleArabic: string;
  description: string[];
  descriptionArabic: string[];
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LeaderDisplay = {
  key: string;
  initials: string;
  initialsAr: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  credentialsEn: string;
  credentialsAr: string;
  credentialsAfterRole?: boolean;
  bioEn: string[];
  bioAr: string[];
  image?: string;
};

const normalizeLineBreaks = (text: string) =>
  text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

export const mapLeadershipToDisplay = (item: LeadershipItem): LeaderDisplay => ({
  key: item._id ?? item.name,
  initials: item.initials?.trim() ?? "",
  initialsAr: item.initialsArabic?.trim() ?? "",
  nameEn: item.name,
  nameAr: item.nameArabic,
  roleEn: normalizeLineBreaks(item.title ?? ""),
  roleAr: normalizeLineBreaks(item.titleArabic ?? ""),
  credentialsEn: "",
  credentialsAr: "",
  bioEn: item.description ?? [],
  bioAr: item.descriptionArabic ?? [],
  image: item.image,
});

export const getAllLeadership = async (): Promise<LeadershipItem[]> => {
  const response = await api.get("/api/v1/leadership");
  const data = response.data?.data;
  return Array.isArray(data) ? (data as LeadershipItem[]) : [];
};

/** Split title into one line per role (newline or 2+ spaces between segments). */
export const titleToLines = (text: string): string[] => {
  const trimmed = text?.trim() ?? "";
  if (!trimmed) return [];

  const byNewline = trimmed
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  const byDoubleSpace = trimmed
    .split(/\s{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (byDoubleSpace.length > 1) return byDoubleSpace;

  return [trimmed];
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
