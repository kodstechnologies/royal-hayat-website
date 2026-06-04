import { departments } from "@/data/departments";
export const slugifySubName = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
export function getSubSlugForDepartment(deptSlug: string, subName: string) {
  const detail = departments.find((d) => d.slug === deptSlug);
  const matched = detail?.subs?.find((s) => s.name.toLowerCase() === subName.toLowerCase());
  return slugifySubName(matched?.name ?? subName);
}
