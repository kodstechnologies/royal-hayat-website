/** Map PACI / identity sex field to appointment-request gender values. */
export function mapPaciSexToGender(sex: string): "male" | "female" | "" {
  const s = sex.trim().toLowerCase();
  if (!s) return "";
  if (s === "m" || s === "1" || s === "male" || s.includes("ذكر")) return "male";
  if (s === "f" || s === "2" || s === "female" || s.includes("أنثى") || s.includes("انثى")) return "female";
  if (s.includes("male") && !s.includes("female")) return "male";
  if (s.includes("female")) return "female";
  return "";
}

/** Normalize identity dateOfBirth to YYYY-MM-DD for date inputs. */
export function identityDateToIso(value: unknown): string {
  if (!value) return "";
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
