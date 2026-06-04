export const DOCTOR_PATH_EXCLUDED_IDS = new Set<string>([
  "dr-madiha-khisaf",
  "dr-wael-ibrahim",
  "dr-fatima-alazemi",
]);
export const SKIP_CIVIL_ID_VERIFICATION = false;
export const GEMINI_TRIAGE_MODEL = "gemini-flash-latest";
export const GEMINI_TRIAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TRIAGE_MODEL}:generateContent`;
export const chipOptions = [
  "Headache",
  "Chest Pain",
  "Fever",
  "Cough",
  "Fatigue",
  "Dizziness",
  "Nausea",
  "Back Pain",
  "Joint Pain",
  "Shortness of Breath",
];
