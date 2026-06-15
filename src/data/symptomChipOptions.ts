export type SymptomChipOption = {
  value: string;
  en: string;
  ar: string;
};

export const SYMPTOM_CHIP_OPTIONS: SymptomChipOption[] = [
  { value: "Headache", en: "Headache", ar: "صداع" },
  { value: "Chest Pain", en: "Chest Pain", ar: "ألم في الصدر" },
  { value: "Fever", en: "Fever", ar: "حمى" },
  { value: "Cough", en: "Cough", ar: "سعال" },
  { value: "Fatigue", en: "Fatigue", ar: "إرهاق" },
  { value: "Dizziness", en: "Dizziness", ar: "دوخة" },
  { value: "Nausea", en: "Nausea", ar: "غثيان" },
  { value: "Back Pain", en: "Back Pain", ar: "ألم الظهر" },
  { value: "Joint Pain", en: "Joint Pain", ar: "ألم المفاصل" },
  { value: "Shortness of Breath", en: "Shortness of Breath", ar: "ضيق في التنفس" },
];

export const getSymptomChipLabel = (value: string, isAr: boolean): string => {
  const option = SYMPTOM_CHIP_OPTIONS.find(
    (item) => item.value.toLowerCase() === value.trim().toLowerCase(),
  );
  if (option) return isAr ? option.ar : option.en;
  return value;
};

export const formatSymptomsForDisplay = (symptoms: string[], isAr: boolean): string =>
  symptoms.map((item) => getSymptomChipLabel(item, isAr)).join(", ");

export const parseSymptomTextParts = (text: string): string[] =>
  text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const chipMatchesTextPart = (chip: SymptomChipOption, part: string): boolean => {
  const normalized = part.toLowerCase();
  return (
    normalized === chip.value.toLowerCase() ||
    normalized === chip.en.toLowerCase() ||
    normalized === chip.ar.toLowerCase()
  );
};

/** Keep chip selection in sync when the user edits the symptom text field. */
export const syncSymptomChipsFromText = (
  text: string,
  currentChips: string[],
): string[] => {
  const parts = parseSymptomTextParts(text);
  return currentChips.filter((chipValue) => {
    const chip = SYMPTOM_CHIP_OPTIONS.find(
      (item) => item.value.toLowerCase() === chipValue.toLowerCase(),
    );
    if (!chip) return true;
    return parts.some((part) => chipMatchesTextPart(chip, part));
  });
};
