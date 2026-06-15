import type { DepartmentDetail } from "@/types/departmentDetail";

type SubDepartment = NonNullable<DepartmentDetail["subDepartments"]>[number];

export const slugifySubName = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function getSubSlugForDepartment(_deptSlug: string, subName: string): string {
  return slugifySubName(subName);
}

export function normalizeSubSlug(
  _deptSlug: string,
  subSlug: string,
  subDepartments?: Pick<SubDepartment, "slug" | "name">[],
): string {
  if (!subDepartments?.length) return subSlug;

  const exact = subDepartments.find((sub) => sub.slug === subSlug);
  if (exact) return exact.slug;

  const legacy = subDepartments.find((sub) => slugifySubName(sub.name) === subSlug);
  return legacy?.slug ?? subSlug;
}

export function resolveSubDepartment(
  dept: { subDepartments?: SubDepartment[] },
  subSlug: string,
): SubDepartment | null {
  if (!dept.subDepartments) return null;

  return (
    dept.subDepartments.find((sub) => sub.slug === subSlug) ??
    dept.subDepartments.find((sub) => slugifySubName(sub.name) === subSlug) ??
    null
  );
}
