import {
  Activity,
  Baby,
  Building2,
  Microscope,
  Scissors,
  Smile,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { BookingDeptRow } from "./types";
const OID = /^[0-9a-fA-F]{24}$/i;
export function departmentSlug(name: string, mongoId: string): string {
  const base = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${mongoId.slice(-6)}`;
}
export function apiRowToBookingDept(row: Record<string, unknown>): BookingDeptRow | null {
  const id = String(row._id ?? "");
  if (!OID.test(id)) return null;
  const name = String(row.name ?? "").trim();
  if (!name) return null;
  if (["Clinical Pharmacy", "Royale Hayat Pharmacy"].includes(name)) return null;
  const cat = row.catagory;
  let category = "";
  if (cat && typeof cat === "object" && cat !== null && "name" in cat) {
    category = String((cat as { name?: string }).name ?? "").trim();
  }
  const mainCategory = category || "Others";
  let icon = Stethoscope;
  const lowerName = name.toLowerCase();
  if (lowerName.includes("dental")) icon = Smile;
  else if (lowerName.includes("pediatric") || lowerName.includes("neonatology")) icon = Baby;
  else if (lowerName.includes("plastic") || lowerName.includes("cosmetic")) icon = Scissors;
  else if (lowerName.includes("dermatology")) icon = Sparkles;
  else if (lowerName.includes("diagnostic") || lowerName.includes("imaging")) icon = Microscope;
  else if (lowerName.includes("surgery")) icon = Scissors;
  else if (lowerName.includes("home health")) icon = Building2;
  else if (lowerName.includes("physio")) icon = Activity;
  return {
    id,
    name,
    nameAr: name,
    category: category || "—",
    slug: departmentSlug(name, id),
    specialityCode: typeof row.departmentId === "string" ? row.departmentId : undefined,
    mainCategory,
    icon,
  };
}
export function normalizeRestoredDeptId(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const s = v.trim();
  if (OID.test(s) || /^\d+$/.test(s)) return s;
  return null;
}
export function isHomeHealthDept(d: BookingDeptRow): boolean {
  const n = d.name.toLowerCase();
  return n.includes("home health") || d.slug === "home-health";
}
export function isAlSafwaDept(d: BookingDeptRow): boolean {
  const n = d.name.toLowerCase();
  return n.includes("safwa") || n.includes("al-safwa") || d.slug.includes("safwa");
}
function normalizeClinicCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
export function heuristicDepartmentIdsFromTokens(tokens: string[], departments: BookingDeptRow[]): string[] {
  const symptomKeywords: Record<string, string[]> = {
    headache: ["neuro", "neurology", "brain", "internal", "medicine"],
    "chest pain": ["cardio", "heart", "internal", "cardiology"],
    fever: ["pediatric", "internal", "medicine", "infection"],
    cough: ["pulmo", "respiratory", "ent", "internal"],
    fatigue: ["internal", "medicine", "endo"],
    dizziness: ["neuro", "ent", "internal"],
    nausea: ["gastro", "internal", "medicine"],
    "back pain": ["ortho", "spine", "physio", "neuro"],
    "joint pain": ["ortho", "rheum", "physio"],
    "shortness of breath": ["pulmo", "cardio", "internal"],
  };
  const hints = new Set<string>();
  for (const t of tokens) {
    const direct = symptomKeywords[t];
    if (direct) direct.forEach((h) => hints.add(h));
    for (const [key, vals] of Object.entries(symptomKeywords)) {
      if (t.includes(key) || key.includes(t)) vals.forEach((h) => hints.add(h));
    }
  }
  const matched = departments.filter((d) => {
    const dn = d.name.toLowerCase();
    const dc = d.category.toLowerCase();
    return [...hints].some((h) => dn.includes(h) || dc.includes(h));
  });
  return matched.length > 0
    ? matched.map((d) => d.id)
    : departments.slice(0, Math.min(3, departments.length)).map((d) => d.id);
}
export function mapAiClinicCodeToDepartmentIds(aiText: string, departments: BookingDeptRow[]): string[] {
  const firstLine = aiText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? "";
  const candidate = firstLine
    .replace(/^clinic\s*code\s*:\s*/i, "")
    .replace(/^[-*]\s*/, "")
    .replace(/^["'`]|["'`]$/g, "")
    .trim();
  if (!candidate || /^no clinic found$/i.test(candidate)) return [];
  const normalizedCandidate = normalizeClinicCode(candidate);
  if (!normalizedCandidate) return [];
  const exact = departments.find(
    (d) => d.specialityCode && normalizeClinicCode(d.specialityCode) === normalizedCandidate,
  );
  return exact ? [exact.id] : [];
}
