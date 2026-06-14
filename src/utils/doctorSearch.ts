export type DoctorSearchFields = {
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  department: string;
  departmentAr: string;
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

const buildDoctorSearchHaystack = (doctor: DoctorSearchFields): string =>
  normalizeSearchText(
    [
      doctor.name,
      doctor.nameAr,
      doctor.specialty,
      doctor.specialtyAr,
      doctor.department,
      doctor.departmentAr,
    ].join(" "),
  );

export const doctorMatchesSearch = (
  doctor: DoctorSearchFields,
  query: string,
): boolean => {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return true;
  const haystack = buildDoctorSearchHaystack(doctor);
  return tokens.every((token) => haystack.includes(token));
};

export const filterDoctorsBySearch = <T extends DoctorSearchFields>(
  list: T[],
  query: string,
): T[] => {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return list;
  return list.filter((doctor) => doctorMatchesSearch(doctor, query));
};
