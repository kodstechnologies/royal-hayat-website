import type { Department } from "@/types/department";

const CMS_SLUG_ALIASES: Record<string, string> = {
  "obstetrics-department": "obstetrics-gynecology",
  "obstetrics-and-gynecology": "obstetrics-gynecology",
  "ob-gyn": "obstetrics-gynecology",
  "plastic-surgery-and-cosmetology": "plastic-surgery",
  "ent-ear-nose-and-throat": "ent",
  "royal-hayat-pharmacy": "royale-hayat-pharmacy",
};

function stripMongoSuffix(slug: string): string {
  return slug.replace(/-[a-f0-9]{6}$/i, "");
}

export function findDepartmentBySlug(
  slug: string | undefined,
  departments: Department[],
): Department | undefined {
  if (!slug) return undefined;

  const exact = departments.find((dept) => dept.slug === slug);
  if (exact) return exact;

  const normalizedUrlSlug = stripMongoSuffix(slug);
  const aliasedUrlSlug = CMS_SLUG_ALIASES[normalizedUrlSlug] ?? normalizedUrlSlug;

  return departments.find((dept) => {
    const normalizedDeptSlug = stripMongoSuffix(dept.slug);
    const aliasedDeptSlug = CMS_SLUG_ALIASES[normalizedDeptSlug] ?? normalizedDeptSlug;
    return (
      normalizedDeptSlug === normalizedUrlSlug ||
      aliasedDeptSlug === aliasedUrlSlug ||
      normalizedUrlSlug.startsWith(`${normalizedDeptSlug}-`) ||
      normalizedDeptSlug.startsWith(`${normalizedUrlSlug}-`)
    );
  });
}
