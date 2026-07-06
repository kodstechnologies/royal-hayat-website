export type DoctorSearchFields = {
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  department: string;
  departmentAr: string;
  allDepartments?: { name: string; nameAr: string }[];
  title?: string;
  titleAr?: string;
  symptoms?: string[];
};

const TATWEEL = /\u0640/g;
const DIACRITICS = /[\u064B-\u065F\u0670]/g;
const ALEF_VARIANTS = /[أإآٱا]/g;
const ALEF_MAKSURA = /ى/g;
const DOCTOR_PREFIX = /^(?:د\.?|dr\.?)\s*/i;

export const normalizeSearchText = (value: string): string =>
  String(value || "")
    .normalize("NFKC")
    .replace(TATWEEL, "")
    .replace(DIACRITICS, "")
    .replace(ALEF_VARIANTS, "ا")
    .replace(ALEF_MAKSURA, "ي")
    .replace(DOCTOR_PREFIX, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const tokenizeSearchQuery = (query: string): string[] => {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
};

const buildDoctorSearchHaystack = (doctor: DoctorSearchFields): string => {
  const departmentTerms =
    doctor.allDepartments?.flatMap((dept) => [dept.name, dept.nameAr]) ?? [
      doctor.department,
      doctor.departmentAr,
    ];

  return normalizeSearchText(
    [
      doctor.name,
      doctor.nameAr,
      doctor.specialty,
      doctor.specialtyAr,
      ...departmentTerms,
      doctor.title,
      doctor.titleAr,
      ...(doctor.symptoms ?? []),
    ].join(" "),
  );
};

const extractCombinedInitials = (text: string): string =>
  text
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const matchesCombinedInitials = (doctor: DoctorSearchFields, query: string): boolean => {
  const compact = query.trim().replace(/[\s.]/g, "").toUpperCase();
  if (compact.length < 2 || !/^[\p{L}]+$/u.test(compact)) return false;

  const englishInitials = extractCombinedInitials(doctor.name);
  if (englishInitials.startsWith(compact)) return true;

  if (doctor.nameAr) {
    const arabicInitials = extractCombinedInitials(doctor.nameAr);
    if (arabicInitials.startsWith(compact)) return true;
  }

  return false;
};

export const doctorMatchesSearch = (
  doctor: DoctorSearchFields,
  query: string,
): boolean => {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return true;

  const haystack = buildDoctorSearchHaystack(doctor);
  if (tokens.every((token) => haystack.includes(token))) {
    return true;
  }

  return matchesCombinedInitials(doctor, query);
};

export const filterDoctorsBySearch = <T extends DoctorSearchFields>(
  list: T[],
  query: string,
): T[] => {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return list;
  return list.filter((doctor) => doctorMatchesSearch(doctor, query));
};
