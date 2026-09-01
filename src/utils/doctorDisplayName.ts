type DoctorNameFields = { id?: string; name: string; nameAr: string };

const DOCTOR_ARABIC_NAME_OVERRIDES: Record<string, string> = {
  "dr-hamid-ghaderi": "د. حميد القادري",
  "Dr. Hamid Ghaderi": "د. حميد القادري",
  E1076: "د. حميد القادري",
};

const getArabicNameOverride = (doc: DoctorNameFields) => {
  if (doc.id && DOCTOR_ARABIC_NAME_OVERRIDES[doc.id]) {
    return DOCTOR_ARABIC_NAME_OVERRIDES[doc.id];
  }
  return DOCTOR_ARABIC_NAME_OVERRIDES[doc.name.trim()];
};

export const resolveDoctorArabicName = (doc: DoctorNameFields) =>
  getArabicNameOverride(doc) ?? doc.nameAr.trim();

export const isDoctorWithDrTitle = (name: string) =>
  /^(dr|prof|professor)\.?\s/i.test(name.trim());

const stripArabicDoctorPrefix = (nameAr: string) =>
  nameAr
    .trim()
    .replace(/^(?:د(?:\.|\s+)|الدكتور\s+|الدكتورة\s+|البروفيسور\s+د(?:\.|\s+))/u, "")
    .trim();

export const formatDoctorDisplayNameAr = (doc: DoctorNameFields) => {
  const override = getArabicNameOverride(doc);
  if (override) return override;

  const nameAr = doc.nameAr.trim();
  const bareName = stripArabicDoctorPrefix(nameAr);
  const hadArabicPrefix = bareName !== nameAr;
  const hasEnglishDrTitle = isDoctorWithDrTitle(doc.name);

  if (!hadArabicPrefix && !hasEnglishDrTitle) return nameAr;

  const effectiveName = bareName || nameAr;
  if (/^prof/i.test(doc.name.trim())) return `البروفيسور د. ${effectiveName}`;
  return `د. ${effectiveName}`;
};

export const getDoctorDisplayName = (
  doc: DoctorNameFields,
  lang: "en" | "ar",
) => (lang === "ar" ? formatDoctorDisplayNameAr(doc) : doc.name);
