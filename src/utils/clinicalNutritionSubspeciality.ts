import { normalizeSubSlug, slugifySubName } from "@/utils/departmentSubSlug";

const CLINICAL_NUTRITION_SUB_SLUG = "clinical-nutrition-dietetics";

const CLINICAL_NUTRITION_DEPT_NAMES = new Set([
  "Internal Medicine",
  "General & Laparoscopic Surgery",
]);

export function isClinicalNutritionSubspecialityName(name?: string): boolean {
  if (!name?.trim()) return false;
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  return (
    normalized.includes("clinical nutrition") ||
    normalized.includes("nutrition & dietetics") ||
    normalized.includes("nutrition and dietetics")
  );
}

type SubRef = { slug?: string; name: string };

export function isClinicalNutritionSubspecialityContext(
  deptName: string,
  opts?: {
    subName?: string;
    subSlug?: string;
    deptSlug?: string;
    subs?: SubRef[];
  },
): boolean {
  if (!CLINICAL_NUTRITION_DEPT_NAMES.has(deptName)) return false;

  if (isClinicalNutritionSubspecialityName(opts?.subName)) return true;

  if (!opts?.subSlug) return false;

  const normalized = opts.deptSlug
    ? normalizeSubSlug(
        opts.deptSlug,
        opts.subSlug,
        opts.subs?.map((sub) => ({
          slug: sub.slug ?? slugifySubName(sub.name),
          name: sub.name,
        })),
      )
    : opts.subSlug;

  if (
    normalized === CLINICAL_NUTRITION_SUB_SLUG ||
    normalized.includes("clinical-nutrition")
  ) {
    return true;
  }

  return (
    opts.subs?.some(
      (sub) =>
        isClinicalNutritionSubspecialityName(sub.name) &&
        (slugifySubName(sub.name) === normalized ||
          sub.slug === normalized ||
          slugifySubName(sub.name) === opts.subSlug),
    ) ?? false
  );
}

export function shouldShowDepartmentDoctorsHeading(
  deptName: string,
  opts?: {
    subName?: string;
    subSlug?: string;
    deptSlug?: string;
    subs?: SubRef[];
  },
): boolean {
  if (deptName === "Clinical Pharmacy") return false;
  if (isClinicalNutritionSubspecialityContext(deptName, opts)) return false;
  return true;
}
