import type { JobPosting } from "@/api/job";

export type LocalizedJob = {
  _id: string;
  title: string;
  category: string;
  location: string;
  type: string;
  desc: string;
  responsibilities: string[];
  requirements: string[];
  postedDate?: string;
};

const pickText = (
  english?: string,
  arabic?: string,
  isAr?: boolean,
): string => {
  const en = english?.trim() ?? "";
  const ar = arabic?.trim() ?? "";
  if (isAr && ar) return ar;
  return en || ar;
};

const pickList = (
  english?: string[],
  arabic?: string[],
  isAr?: boolean,
): string[] => {
  const en = (english ?? []).map((item) => item.trim()).filter(Boolean);
  const ar = (arabic ?? []).map((item) => item.trim()).filter(Boolean);
  if (isAr && ar.length > 0) return ar;
  return en.length > 0 ? en : ar;
};

/** Map API job to UI fields for the active site language (fallback to English when Arabic is empty). */
export const localizeJobPosting = (
  job: JobPosting,
  isAr: boolean,
  fallbackId: string | number = "",
): LocalizedJob | null => {
  const title = pickText(job.title, job.arabicTitle as string | undefined, isAr);
  if (!title) return null;

  const mongoId = String(job._id ?? job.id ?? fallbackId);
  const category =
    job.department?.toString().trim() ||
    job.category?.toString().trim() ||
    (job.classification as string | undefined)?.toString().trim() ||
    "General";

  return {
    _id: mongoId,
    title,
    category,
    location:
      pickText(job.location, job.arabicLocation as string | undefined, isAr) ||
      (isAr ? "في الموقع" : "On-site"),
    type: job.type?.toString().trim() || "Full-time",
    desc: pickText(
      (job.description ?? job.desc) as string | undefined,
      job.arabicDescription as string | undefined,
      isAr,
    ),
    responsibilities: pickList(
      job.responsibilities,
      job.arabicResponsibilities as string[] | undefined,
      isAr,
    ),
    requirements: pickList(
      job.requirements,
      job.arabicRequirements as string[] | undefined,
      isAr,
    ),
    postedDate:
      typeof job.postedDate === "string"
        ? job.postedDate
        : job.postedDate
          ? String(job.postedDate)
          : undefined,
  };
};
