import type { JobPosting } from "@/api/job";

export type MappedJobListItem = {
  id: string;
  title: string;
  category: string;
  location: string;
  type: string;
  desc: string;
};

export type MappedJobDetail = MappedJobListItem & {
  date: string;
  responsibilities: string[];
  requirements: string[];
  educationAndLicensure: string[];
  professionalExperience: string[];
  specializedKnowledge: string[];
};

const pickLocalizedList = (
  isAr: boolean,
  english?: string[],
  arabic?: string[],
): string[] => {
  if (isAr && arabic?.length) return arabic;
  return english ?? [];
};

const pickLocalizedText = (
  isAr: boolean,
  english?: string,
  arabic?: string,
): string => {
  if (isAr && arabic?.trim()) return arabic.trim();
  return english ?? "";
};

const mapJobBase = (job: JobPosting, isAr = false): MappedJobListItem => ({
  id: String(job._id ?? job.id ?? ""),
  title: pickLocalizedText(isAr, job.title, job.arabicTitle as string | undefined),
  category: pickLocalizedText(
    isAr,
    String(job.classification ?? job.category ?? job.department ?? ""),
    job.arabicClassification as string | undefined,
  ),
  location: pickLocalizedText(
    isAr,
    job.location,
    job.arabicLocation as string | undefined,
  ),
  type: job.type ?? "",
  desc: pickLocalizedText(
    isAr,
    job.description ?? job.desc,
    job.arabicDescription as string | undefined,
  ),
});

export const mapJobPostingToListItem = (
  job: JobPosting,
  isAr = false,
): MappedJobListItem => mapJobBase(job, isAr);

export const mapJobPostingToDetail = (
  job: JobPosting,
  isAr = false,
): MappedJobDetail => ({
  ...mapJobBase(job, isAr),
  date: job.postedDate ?? job.date ?? "",
  responsibilities: pickLocalizedList(
    isAr,
    job.responsibilities,
    job.arabicResponsibilities,
  ),
  requirements: pickLocalizedList(
    isAr,
    job.requirements,
    job.arabicRequirements,
  ),
  educationAndLicensure: pickLocalizedList(
    isAr,
    job.educationAndLicensure,
    job.arabicEducationAndLicensure,
  ),
  professionalExperience: pickLocalizedList(
    isAr,
    job.professionalExperience,
    job.arabicProfessionalExperience,
  ),
  specializedKnowledge: pickLocalizedList(
    isAr,
    job.specializedKnowledge,
    job.arabicSpecializedKnowledge,
  ),
});
