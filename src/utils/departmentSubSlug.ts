import { departmentDetails } from "@/data/departmentDetails";

export const slugifySubName = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** URL segment for a subspeciality under a department slug (matches DepartmentDetail routes). */
export function getSubSlugForDepartment(deptSlug: string, subName: string) {
  const detail = departmentDetails.find((d) => d.slug === deptSlug);
  const matched = detail?.subDepartments?.find((s) => s.name.toLowerCase() === subName.toLowerCase());
  return matched?.slug ?? slugifySubName(subName);
}
