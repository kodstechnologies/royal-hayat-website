import { departmentDetails, type DepartmentDetail } from "@/data/departmentDetails";
import { departments } from "@/data/departments";

type SubDepartment = NonNullable<DepartmentDetail["subDepartments"]>[number];

export const slugifySubName = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Canonical sub-specialty slug for navigation (from departmentDetails when available). */
export function getSubSlugForDepartment(deptSlug: string, subName: string): string {
  const detail = departmentDetails.find((d) => d.slug === deptSlug);
  const matched = detail?.subDepartments?.find(
    (s) => s.name.toLowerCase() === subName.toLowerCase()
  );
  if (matched) return matched.slug;

  const dept = departments.find((d) => d.slug === deptSlug);
  const deptSub = dept?.subs?.find((s) => s.name.toLowerCase() === subName.toLowerCase());
  return slugifySubName(deptSub?.name ?? subName);
}

/** Map a URL or stored slug to the canonical sub-department slug. */
export function normalizeSubSlug(deptSlug: string, subSlug: string): string {
  const detail = departmentDetails.find((d) => d.slug === deptSlug);
  if (!detail?.subDepartments) return subSlug;

  const exact = detail.subDepartments.find((s) => s.slug === subSlug);
  if (exact) return exact.slug;

  const legacy = detail.subDepartments.find((s) => slugifySubName(s.name) === subSlug);
  return legacy?.slug ?? subSlug;
}

/** Resolve sub-department from URL slug (exact or legacy slugify match). */
export function resolveSubDepartment(
  dept: { subDepartments?: SubDepartment[] },
  subSlug: string
): SubDepartment | null {
  if (!dept.subDepartments) return null;

  return (
    dept.subDepartments.find((s) => s.slug === subSlug) ??
    dept.subDepartments.find((s) => slugifySubName(s.name) === subSlug) ??
    null
  );
}
