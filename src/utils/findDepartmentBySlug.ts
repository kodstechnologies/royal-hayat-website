import type { Department } from "@/types/department";

const CMS_SLUG_ALIASES: Record<string, string> = {
  "obstetrics-department": "obstetrics-gynecology",
  "obstetrics-and-gynecology": "obstetrics-gynecology",
  "ob-gyn": "obstetrics-gynecology",
  "plastic-surgery-and-cosmetology": "plastic-surgery",
  "ent-ear-nose-and-throat": "ent",
  "royal-hayat-pharmacy": "royale-hayat-pharmacy",
};

export function findDepartmentBySlug(
  slug: string | undefined,
  departments: Department[],
): Department | undefined {
  if (!slug) return undefined;

  const exact = departments.find((dept) => dept.slug === slug);
  if (exact) return exact;

  const withoutMongoSuffix = slug.replace(/-[a-f0-9]{6}$/i, "");
  const aliased = CMS_SLUG_ALIASES[withoutMongoSuffix];
  if (aliased) {
    const match = departments.find((dept) => dept.slug === aliased);
    if (match) return match;
  }

  return departments.find(
    (dept) =>
      dept.slug === withoutMongoSuffix || withoutMongoSuffix.startsWith(`${dept.slug}-`),
  );
}
