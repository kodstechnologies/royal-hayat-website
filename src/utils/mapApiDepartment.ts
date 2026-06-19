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
import type { ApiCategoryWithNested } from "@/api/catagory";
import type { Department, MainCategory } from "@/types/department";
import { MAIN_CATEGORIES } from "@/types/department";
import { departmentSlug } from "@/pages/book-appointment/utils";
import { compareDoctorsPageDepartments } from "@/utils/doctorDepartmentOrder";

const OID = /^[0-9a-fA-F]{24}$/i;

const API_CATEGORY_TO_MAIN: Record<string, MainCategory> = {
  "CLINICAL SPECIALITY": "Clinical Speciality",
  "CLINICAL SUPPORT SERVICE": "Clinical Support Service",
  "HOME CARE SERVICE": "Home Care Service",
};

const CATEGORY_ALIASES_TO_MAIN: Record<string, MainCategory> = {
  "clinical speciality": "Clinical Speciality",
  "clinical support service": "Clinical Support Service",
  "home care service": "Home Care Service",
};

const ARABIC_CATEGORY_TO_MAIN: Record<string, MainCategory> = {
  "التخصصات السريرية": "Clinical Speciality",
  "التخصصات الطبية": "Clinical Speciality",
  "خدمات الدعم السريري": "Clinical Support Service",
  "الخدمات الطبية الداعمة": "Clinical Support Service",
  "خدمات الرعاية المنزلية": "Home Care Service",
};

function normalizeMainCategory(
  categoryName: string,
  arabicCategoryName = "",
): MainCategory | undefined {
  const trimmed = categoryName.trim();
  if (trimmed) {
    const upper = trimmed.toUpperCase();
    if (API_CATEGORY_TO_MAIN[upper]) return API_CATEGORY_TO_MAIN[upper];
    const lower = trimmed.toLowerCase();
    if (CATEGORY_ALIASES_TO_MAIN[lower]) return CATEGORY_ALIASES_TO_MAIN[lower];
  }

  const arabic = arabicCategoryName.trim();
  if (arabic && ARABIC_CATEGORY_TO_MAIN[arabic]) {
    return ARABIC_CATEGORY_TO_MAIN[arabic];
  }

  return undefined;
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
  let apiCategoryArabicName = "";
  if (cat && typeof cat === "object" && cat !== null) {
    if ("name" in cat) {
      apiCategoryName = String((cat as { name?: string }).name ?? "").trim();
    }
    if ("arabicName" in cat) {
      apiCategoryArabicName = String((cat as { arabicName?: string }).arabicName ?? "").trim();
    }
  }

  const mainCategory = normalizeMainCategory(apiCategoryName, apiCategoryArabicName);
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
  const sortedRows = [...rows].sort((a, b) =>
    compareDoctorsPageDepartments(String(a.name ?? ""), String(b.name ?? "")),
  );

  return sortedRows
    .map((row, index) => mapApiDepartmentRow(row as Record<string, unknown>, index))
    .filter((dept): dept is Department => dept !== null);
}

export type CategoryDisplaySection = {
  sectionKey: string;
  label: string;
  labelAr: string;
  mainCategory?: MainCategory;
  departments: Department[];
};

/** Map API categories → UI sections (one block per category, departments nested inside). */
export function mapCategoriesToDisplaySections(
  categories: ApiCategoryWithNested[],
): CategoryDisplaySection[] {
  const mainCategoryOrder = new Map(
    MAIN_CATEGORIES.map((category, index) => [category.key, index]),
  );

  const sections = categories
    .map((category) => {
      const activeRows = (category.departments ?? [])
        .filter((dep) => dep.isActive !== false)
        .map((dep) => ({
          ...(dep as Record<string, unknown>),
          catagory: {
            _id: category._id,
            name: category.name,
            arabicName: category.arabicName ?? "",
          },
        }));

      const departments = mapApiDepartmentsToDisplay(activeRows as DepartmentListItem[]);
      if (departments.length === 0) return null;

      const knownMain = normalizeMainCategory(category.name, category.arabicName ?? "");
      const staticMeta = knownMain
        ? MAIN_CATEGORIES.find((item) => item.key === knownMain)
        : undefined;

      return {
        sectionKey: category._id || category.name,
        label: staticMeta?.label ?? category.name,
        labelAr: staticMeta?.labelAr ?? category.arabicName ?? category.name,
        mainCategory: knownMain,
        departments,
      };
    })
    .filter((section): section is CategoryDisplaySection => section !== null);

  return sections.sort((a, b) => {
    const orderA = a.mainCategory ? (mainCategoryOrder.get(a.mainCategory) ?? 99) : 100;
    const orderB = b.mainCategory ? (mainCategoryOrder.get(b.mainCategory) ?? 99) : 100;
    if (orderA !== orderB) return orderA - orderB;
    return a.label.localeCompare(b.label);
  });
}
