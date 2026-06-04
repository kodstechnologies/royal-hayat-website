import type { DepartmentDetail } from "@/data/departmentDetails";

/** CMS / AI slugs that differ from static site slugs */
const CMS_SLUG_ALIASES: Record<string, string> = {
  "obstetrics-department": "obstetrics-gynecology",
  "obstetrics-and-gynecology": "obstetrics-gynecology",
  "ob-gyn": "obstetrics-gynecology",
  "plastic-surgery-and-cosmetology": "plastic-surgery",
  "ent-ear-nose-and-throat": "ent",
  "royal-hayat-pharmacy": "royale-hayat-pharmacy",
};

/**
 * Resolve route :slug to a departmentDetails entry (handles legacy CMS/AI links).
 */
export function resolveDepartmentBySlug(
  slug: string | undefined,
  departmentDetails: DepartmentDetail[],
) {
  if (!slug) return undefined;

  const knownSlugs = new Set(departmentDetails.map((d) => d.slug));
  const exact = departmentDetails.find((d) => d.slug === slug);
  if (exact) return exact;

  const withoutMongoSuffix = slug.replace(/-[a-f0-9]{6}$/i, "");
  const aliased = CMS_SLUG_ALIASES[withoutMongoSuffix];
  if (aliased) {
    return departmentDetails.find((d) => d.slug === aliased);
  }

  if (knownSlugs.has(withoutMongoSuffix)) {
    return departmentDetails.find((d) => d.slug === withoutMongoSuffix);
  }

  for (const dept of departmentDetails) {
    if (withoutMongoSuffix === dept.slug || withoutMongoSuffix.startsWith(`${dept.slug}-`)) {
      return dept;
    }
  }

  return undefined;
}
