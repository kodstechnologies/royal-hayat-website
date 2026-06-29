import type { Doctor } from "@/data/loadDoctors";
import { resolveDoctorArabicName } from "@/utils/doctorDisplayName";

const TITLE_PREFIX = /^(?:dr|prof|professor)\.?\s+/i;
const ARABIC_TITLE_PREFIX = /^(?:د\.?\s*|الدكتور\s*|الدكتورة\s*|البروفيسور\s+د\.?\s*)/u;
const DERMATOLOGY_DEPT = "Dermatology";
const DERMATOLOGY_HEAD_DOCTOR_KEY = "suraj v davis";

export const stripDoctorTitlePrefix = (name: string): string => {
  let result = String(name ?? "").trim();

  while (TITLE_PREFIX.test(result)) {
    result = result.replace(TITLE_PREFIX, "").trim();
  }

  return result;
};

const stripArabicTitlePrefix = (name: string): string => {
  let result = String(name ?? "").trim();

  while (ARABIC_TITLE_PREFIX.test(result)) {
    result = result.replace(ARABIC_TITLE_PREFIX, "").trim();
  }

  return result;
};

const normalizeDoctorNameKey = (name: string): string =>
  stripDoctorTitlePrefix(name)
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();

const isDermatologyHeadDoctor = (doc: Pick<Doctor, "name">): boolean =>
  normalizeDoctorNameKey(doc.name) === DERMATOLOGY_HEAD_DOCTOR_KEY;

export const getDoctorSortKey = (
  doc: Pick<Doctor, "name" | "nameAr">,
  _deptName: string,
  lang: "en" | "ar",
): string => {
  if (lang === "ar") {
    return stripArabicTitlePrefix(resolveDoctorArabicName(doc));
  }
  return stripDoctorTitlePrefix(doc.name);
};

/** First given name after title stripping — used for book-appointment doctor lists. */
export const getDoctorFirstNameSortKey = (
  doc: Pick<Doctor, "name" | "nameAr">,
  lang: "en" | "ar",
): string => {
  const fullName = getDoctorSortKey(doc, "", lang);
  return fullName.split(/\s+/).filter(Boolean)[0] ?? fullName;
};

const sortDoctorsByFirstName = (
  docs: Doctor[],
  lang: "en" | "ar",
): Doctor[] => {
  const locale = lang === "ar" ? "ar" : "en";
  return [...docs].sort((a, b) =>
    getDoctorFirstNameSortKey(a, lang).localeCompare(getDoctorFirstNameSortKey(b, lang), locale, {
      sensitivity: "base",
    }),
  );
};

const pinDermatologyHeadDoctor = (docs: Doctor[]): Doctor[] => {
  const headDoctor = docs.find(isDermatologyHeadDoctor);
  if (!headDoctor) {
    return docs;
  }
  return [headDoctor, ...docs.filter((doc) => doc !== headDoctor)];
};

export const sortDoctorsInDepartment = (
  docs: Doctor[],
  deptName: string,
  lang: "en" | "ar",
): Doctor[] => {
  const locale = lang === "ar" ? "ar" : "en";
  const sorted = [...docs].sort((a, b) =>
    getDoctorSortKey(a, deptName, lang).localeCompare(getDoctorSortKey(b, deptName, lang), locale, {
      sensitivity: "base",
    }),
  );

  if (deptName !== DERMATOLOGY_DEPT) {
    return sorted;
  }

  return pinDermatologyHeadDoctor(sorted);
};

export const sortDoctorsAlphabetically = (docs: Doctor[], lang: "en" | "ar"): Doctor[] =>
  sortDoctorsInDepartment(docs, "", lang);

/** Book appointment: first-name alphabetical order; Dermatology keeps Dr. Suraj V. Davis first. */
export const sortDoctorsForBooking = (
  docs: Doctor[],
  deptName: string,
  lang: "en" | "ar",
): Doctor[] => {
  const sorted = sortDoctorsByFirstName(docs, lang);
  if (deptName !== DERMATOLOGY_DEPT) {
    return sorted;
  }
  return pinDermatologyHeadDoctor(sorted);
};

/** I Know My Doctor — all departments, first-name order (no dept-specific pin). */
export const sortAllDoctorsForBooking = (docs: Doctor[], lang: "en" | "ar"): Doctor[] =>
  sortDoctorsByFirstName(docs, lang);
