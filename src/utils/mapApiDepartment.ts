import {
  Activity,
  AlertCircle,
  Baby,
  Building2,
  Heart,
  Home,
  Microscope,
  Pill,
  Scissors,
  Shield,
  Smile,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DepartmentListItem } from "@/api/department";
import type { Department, MainCategory } from "@/types/department";
import { departmentSlug } from "@/pages/book-appointment/utils";

const OID = /^[0-9a-fA-F]{24}$/i;

const API_CATEGORY_TO_MAIN: Record<string, MainCategory> = {
  "CLINICAL SPECIALITY": "Clinical Speciality",
  "CLINICAL SUPPORT SERVICE": "Clinical Support Service",
  "HOME CARE SERVICE": "Home Care Service",
};

function normalizeMainCategory(categoryName: string): MainCategory | undefined {
  return API_CATEGORY_TO_MAIN[categoryName.trim().toUpperCase()];
}

function inferDepartmentIcon(name: string): LucideIcon {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("obstetric") || lowerName.includes("gynecolog") || lowerName.includes("ivf")) {
    return Heart;
  }
  if (lowerName.includes("dental")) return Smile;
  if (lowerName.includes("pediatric") || lowerName.includes("neonatal")) return Baby;
  if (lowerName.includes("plastic") || lowerName.includes("cosmetic")) return Scissors;
  if (lowerName.includes("dermatology")) return Sparkles;
  if (lowerName.includes("diagnostic") || lowerName.includes("imaging") || lowerName.includes("laboratory")) {
    return Microscope;
  }
  if (lowerName.includes("surgery")) return Scissors;
  if (lowerName.includes("home health")) return Home;
  if (lowerName.includes("physio")) return Activity;
  if (lowerName.includes("pharmacy")) return Pill;
  if (lowerName.includes("intensive care") || lowerName.includes("emergency")) return AlertCircle;
  if (lowerName.includes("safwa")) return Shield;
  if (lowerName.includes("home")) return Building2;
  return Stethoscope;
}

export function mapApiDepartmentRow(
  row: Record<string, unknown>,
  index: number,
): Department | null {
  const mongoId = String(row._id ?? "");
  if (!OID.test(mongoId)) return null;

  const name = String(row.name ?? "").trim();
  if (!name || name === "Allergy & Immunology") return null;

  const departmentId =
    typeof row.departmentId === "string" ? row.departmentId.trim() : undefined;

  const cat = row.catagory;
  let apiCategoryName = "";
  if (cat && typeof cat === "object" && cat !== null && "name" in cat) {
    apiCategoryName = String((cat as { name?: string }).name ?? "").trim();
  }

  const mainCategory = normalizeMainCategory(apiCategoryName);
  const deptTagline = String(row.deptTagline ?? "").trim();
  const deptTaglineArabic = String(row.deptTaglineArabic ?? "").trim();
  const desc = deptTagline || String(row.description ?? "").trim();
  const descAr = deptTaglineArabic || String(row.arabicDescription ?? "").trim();
  const nameAr = String(row.arabicName ?? name).trim();
  const medicalField = String(row.medicalField ?? "").trim();
  const medicalFieldAr = String(row.medicalFieldAr ?? "").trim();
  const img = String(row.image ?? "").trim();

  return {
    id: index + 1,
    name,
    nameAr,
    desc,
    descAr,
    medicalField: medicalField || undefined,
    medicalFieldAr: medicalFieldAr || undefined,
    img,
    slug: departmentSlug(name, mongoId),
    icon: inferDepartmentIcon(name),
    category: apiCategoryName,
    clinicCode: departmentId,
    mainCategory,
    mongoId,
    order: typeof row.order === "number" ? row.order : Number(row.order) || index,
  };
}

export function mapApiDepartmentsToDisplay(rows: DepartmentListItem[]): Department[] {
  const sortedRows = [...rows].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0),
  );

  return sortedRows
    .map((row, index) => mapApiDepartmentRow(row as Record<string, unknown>, index))
    .filter((dept): dept is Department => dept !== null);
}
