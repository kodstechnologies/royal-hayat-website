import type { Doctor } from "@/data/loadDoctors";

const TITLE_PREFIX = /^(?:dr|prof|professor)\.?\s+/i;

export const stripDoctorTitlePrefix = (name: string): string => {
  let result = String(name ?? "").trim();

  while (TITLE_PREFIX.test(result)) {
    result = result.replace(TITLE_PREFIX, "").trim();
  }

  return result;
};

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
  return [...docs].sort((a, b) =>
    getDoctorSortKey(a, deptName, lang).localeCompare(getDoctorSortKey(b, deptName, lang), locale, {
      sensitivity: "base",
    }),
  );
};

export const sortDoctorsAlphabetically = (docs: Doctor[], lang: "en" | "ar"): Doctor[] =>
  sortDoctorsInDepartment(docs, "", lang);
