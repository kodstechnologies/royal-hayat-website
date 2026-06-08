import type { Doctor } from "@/data/loadDoctors";

const ANESTHESIA_DEPARTMENTS = new Set(["Anesthesia", "Anesthesia & Intensive Care"]);

const stripTitlePrefix = (name: string) =>
  name.replace(/^(dr|prof|professor)\.?\s+/i, "").trim();

export const getDoctorSortKey = (
  doc: Pick<Doctor, "name" | "nameAr">,
  deptName: string,
  lang: "en" | "ar",
): string => {
  const name = lang === "ar" ? doc.nameAr : doc.name;
  return ANESTHESIA_DEPARTMENTS.has(deptName) ? stripTitlePrefix(name) : name;
};

export const sortDoctorsInDepartment = (
  docs: Doctor[],
  deptName: string,
  lang: "en" | "ar",
): Doctor[] => {
  const locale = lang === "ar" ? "ar" : "en";
  return [...docs].sort((a, b) =>
    getDoctorSortKey(a, deptName, lang).localeCompare(
      getDoctorSortKey(b, deptName, lang),
      locale,
    ),
  );
};
