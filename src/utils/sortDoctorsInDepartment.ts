import type { Doctor } from "@/data/loadDoctors";

const TITLE_PREFIX = /^(?:dr|prof|professor)\.?\s+/i;
const DERMATOLOGY_DEPT = "Dermatology";
const DERMATOLOGY_HEAD_DOCTOR_KEY = "suraj v davis";

export const stripDoctorTitlePrefix = (name: string): string => {
  let result = String(name ?? "").trim();

  while (TITLE_PREFIX.test(result)) {
    result = result.replace(TITLE_PREFIX, "").trim();
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
  const name = lang === "ar" ? doc.nameAr : doc.name;
  return stripDoctorTitlePrefix(name);
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

  const headDoctor = sorted.find(isDermatologyHeadDoctor);
  if (!headDoctor) {
    return sorted;
  }

  return [headDoctor, ...sorted.filter((doc) => doc !== headDoctor)];
};

export const sortDoctorsAlphabetically = (docs: Doctor[], lang: "en" | "ar"): Doctor[] =>
  sortDoctorsInDepartment(docs, "", lang);
