type DoctorNameFields = { name: string; nameAr: string };

export const isDoctorWithDrTitle = (name: string) =>
  /^(dr|prof|professor)\.?\s/i.test(name.trim());

const stripArabicDoctorPrefix = (nameAr: string) =>
  nameAr.trim().replace(/^(?:د\.?\s*|الدكتور\s*|الدكتورة\s*|البروفيسور\s+د\.?\s*)/u, "").trim();

export const formatDoctorDisplayNameAr = (doc: DoctorNameFields) => {
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
