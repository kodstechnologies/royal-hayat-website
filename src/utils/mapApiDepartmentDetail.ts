import { mapApiDoctorRowToDoctor } from "@/api/doctors";
import type { DepartmentDetail, DepartmentDetailSection } from "@/data/departmentDetails";
import type { Doctor } from "@/data/doctors";
import { departments as staticDepartments } from "@/data/departments";
import { slugifySubName } from "@/utils/departmentSubSlug";

function findStaticDepartment(name: string, departmentId?: string) {
  if (departmentId) {
    const byCode = staticDepartments.find((dept) => dept.clinicCode === departmentId);
    if (byCode) return byCode;
  }
  return staticDepartments.find(
    (dept) => dept.name.localeCompare(name, undefined, { sensitivity: "accent" }) === 0,
  );
}

function mapContentBlocks(
  blocks: unknown,
  itemsKey: "explaination" | "explanations",
  itemsArKey: "arabicExplaination" | "arabicExplanations",
): DepartmentDetailSection[] {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return null;
      const row = block as Record<string, unknown>;
      const items = Array.isArray(row[itemsKey])
        ? (row[itemsKey] as unknown[]).map((item) => String(item).trim()).filter(Boolean)
        : undefined;
      const itemsAr = Array.isArray(row[itemsArKey])
        ? (row[itemsArKey] as unknown[]).map((item) => String(item).trim()).filter(Boolean)
        : undefined;

      return {
        title: String(row.heading ?? "").trim(),
        titleAr: String(row.arabicHeading ?? "").trim() || undefined,
        content: String(row.subHeading ?? "").trim() || undefined,
        contentAr: String(row.arabicSubHeading ?? "").trim() || undefined,
        items: items?.length ? items : undefined,
        itemsAr: itemsAr?.length ? itemsAr : undefined,
      } satisfies DepartmentDetailSection;
    })
    .filter((section): section is DepartmentDetailSection => {
      if (!section) return false;
      return Boolean(
        section.title ||
          section.titleAr ||
          section.content ||
          section.contentAr ||
          section.items?.length ||
          section.itemsAr?.length,
      );
    });
}

export function mergeDepartmentDetail(
  apiDetail: DepartmentDetail,
  staticDetail?: DepartmentDetail,
): DepartmentDetail {
  if (!staticDetail) return apiDetail;

  return {
    slug: apiDetail.slug || staticDetail.slug,
    name: apiDetail.name || staticDetail.name,
    nameAr: apiDetail.nameAr || staticDetail.nameAr,
    intro: apiDetail.intro || staticDetail.intro,
    introAr: apiDetail.introAr || staticDetail.introAr,
    sections: apiDetail.sections.length > 0 ? apiDetail.sections : staticDetail.sections,
    subDepartments:
      apiDetail.subDepartments && apiDetail.subDepartments.length > 0
        ? apiDetail.subDepartments
        : staticDetail.subDepartments,
  };
}

export function mapApiDepartmentDetailResponse(
  data: {
    department: Record<string, unknown>;
    subspecialities: Record<string, unknown>[];
    doctors: Record<string, unknown>[];
  },
  fallbackSlug: string,
): { detail: DepartmentDetail; doctors: Doctor[]; image: string; mongoId: string } {
  const department = data.department;
  const mongoId = String(department._id ?? "");
  const name = String(department.name ?? "").trim();
  const nameAr = String(department.arabicName ?? name).trim();
  const intro = String(department.description ?? "").trim();
  const introAr = String(department.arabicDescription ?? "").trim();
  const image = typeof department.image === "string" ? department.image.trim() : "";
  const departmentCode =
    typeof department.departmentId === "string" ? department.departmentId.trim() : undefined;

  const staticMatch = findStaticDepartment(name, departmentCode);
  const slug = staticMatch?.slug || fallbackSlug;

  const sections = mapContentBlocks(
    department.customExplainantions,
    "explaination",
    "arabicExplaination",
  );

  const subDepartments = data.subspecialities
    .map((sub) => {
      const subName = String(sub.name ?? "").trim();
      if (!subName) return null;

      return {
        slug: slugifySubName(subName),
        name: subName,
        nameAr: String(sub.arabicName ?? subName).trim(),
        intro: String(sub.description ?? "").trim(),
        introAr: String(sub.arabicDescription ?? "").trim(),
        sections: mapContentBlocks(sub.customSubspecialities, "explanations", "arabicExplanations"),
      };
    })
    .filter((sub): sub is NonNullable<typeof sub> => sub !== null);

  const doctors = data.doctors.map((row) => mapApiDoctorRowToDoctor(row, name, nameAr));

  return {
    mongoId,
    image: image || staticMatch?.img || "",
    doctors,
    detail: {
      slug,
      name,
      nameAr,
      intro,
      introAr: introAr || undefined,
      sections,
      subDepartments: subDepartments.length > 0 ? subDepartments : undefined,
    },
  };
}

export function mapApiSubspecialitiesToDepartmentSubs(
  subspecialities: Record<string, unknown>[],
): NonNullable<import("@/data/departments").Department["subs"]> {
  return subspecialities
    .map((sub) => {
      const name = String(sub.name ?? "").trim();
      if (!name) return null;
      return {
        name,
        nameAr: String(sub.arabicName ?? name).trim(),
      };
    })
    .filter((sub): sub is NonNullable<typeof sub> => sub !== null);
}

export function getDepartmentCardCacheKey(dept: {
  mongoId?: string;
  slug: string;
  name: string;
}): string {
  return dept.mongoId || dept.slug || dept.name;
}

export function getDepartmentLookupId(dept: {
  mongoId?: string;
  clinicCode?: string;
  name: string;
}): string | undefined {
  return dept.mongoId || dept.clinicCode || dept.name;
}
