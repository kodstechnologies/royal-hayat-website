/**
 * Fixed department display order for the public /doctors and /departments pages.
 * API department names are matched via aliases (e.g. "General Surgery", "Pediatric").
 */
const DOCTORS_PAGE_DEPARTMENT_ORDER = [
  "Obstetrics & Gynecology",
  "Neonatal",
  "Pediatrics",
  "General & Laparoscopic Surgery",
  "Internal Medicine",
  "Nutricare",
  "Family Medicine",
  "ENT (Ear, Nose & Throat)",
  "Plastic Surgery & Cosmetology",
  "Reproductive Medicine & IVF",
  "Dermatology",
  "Dental Clinic",
  "Anesthesia",
  "Laboratory Services",
  "Center for Diagnostic Imaging",
  "Royale Hayat Pharmacy",
  "Clinical Pharmacy",
] as const;

const DEPARTMENT_ORDER_ALIASES: Record<string, readonly string[]> = {
  "Obstetrics & Gynecology": ["Obstetrics & Gynecology", "Obstetrics and Gynecology"],
  Neonatal: ["Neonatal"],
  Pediatrics: ["Pediatrics", "Pediatric"],
  "General & Laparoscopic Surgery": ["General & Laparoscopic Surgery", "General Surgery"],
  "Internal Medicine": ["Internal Medicine"],
  Nutricare: ["Nutricare"],
  "Family Medicine": ["Family Medicine"],
  "ENT (Ear, Nose & Throat)": ["ENT (Ear, Nose & Throat)", "ENT"],
  "Plastic Surgery & Cosmetology": [
    "Plastic Surgery & Cosmetology",
    "La Cosmetique",
    "Plastic Surgery",
  ],
  "Reproductive Medicine & IVF": [
    "Reproductive Medicine & IVF",
    "IVF",
    "Reproductive Medicine",
    "IVF & Reproductive Medicine",
  ],
  Dermatology: ["Dermatology"],
  "Dental Clinic": ["Dental Clinic", "Dental"],
  Anesthesia: ["Anesthesia", "Anesthesia & Intensive Care"],
  "Laboratory Services": ["Laboratory Services", "Laboratory"],
  "Center for Diagnostic Imaging": ["Center for Diagnostic Imaging", "Radiology"],
  "Royale Hayat Pharmacy": ["Royale Hayat Pharmacy", "Pharmacy"],
  "Clinical Pharmacy": ["Clinical Pharmacy"],
};

const normalizeDepartmentKey = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const departmentOrderIndexByKey = new Map<string, number>();

DOCTORS_PAGE_DEPARTMENT_ORDER.forEach((canonical, index) => {
  departmentOrderIndexByKey.set(normalizeDepartmentKey(canonical), index);
  const aliases = DEPARTMENT_ORDER_ALIASES[canonical] ?? [canonical];
  for (const alias of aliases) {
    departmentOrderIndexByKey.set(normalizeDepartmentKey(alias), index);
  }
});

export const DOCTORS_PAGE_DEPARTMENT_ORDER_FALLBACK = DOCTORS_PAGE_DEPARTMENT_ORDER.length;

export const getDoctorsPageDepartmentOrderIndex = (departmentName: string): number => {
  const key = normalizeDepartmentKey(departmentName);
  if (!key) return DOCTORS_PAGE_DEPARTMENT_ORDER_FALLBACK;
  return departmentOrderIndexByKey.get(key) ?? DOCTORS_PAGE_DEPARTMENT_ORDER_FALLBACK;
};

export const compareDoctorsPageDepartments = (deptA: string, deptB: string, locale = "en"): number => {
  const orderA = getDoctorsPageDepartmentOrderIndex(deptA);
  const orderB = getDoctorsPageDepartmentOrderIndex(deptB);
  if (orderA !== orderB) return orderA - orderB;
  return deptA.localeCompare(deptB, locale, { sensitivity: "base" });
};

export const sortDepartmentsByDisplayOrder = <T extends { name: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => compareDoctorsPageDepartments(a.name, b.name));
