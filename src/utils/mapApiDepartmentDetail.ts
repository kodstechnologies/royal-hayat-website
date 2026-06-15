import { mapApiDoctorRowToDoctor } from "@/api/doctors";
import type { DepartmentDetail, DepartmentDetailSection } from "@/types/departmentDetail";
import type { Doctor } from "@/types/doctor";
import type { MainCategory } from "@/types/department";
import { departmentSlug } from "@/pages/book-appointment/utils";
import { slugifySubName } from "@/utils/departmentSubSlug";

const API_CATEGORY_TO_MAIN: Record<string, MainCategory> = {
  "CLINICAL SPECIALITY": "Clinical Speciality",
  "CLINICAL SUPPORT SERVICE": "Clinical Support Service",
  "HOME CARE SERVICE": "Home Care Service",
};

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

export function mapApiDepartmentDetailResponse(
  data: {
    department: Record<string, unknown>;
    subspecialities: Record<string, unknown>[];
    doctors: Record<string, unknown>[];
  },
  fallbackSlug: string,
): {
  detail: DepartmentDetail;
  doctors: Doctor[];
  image: string;
  mongoId: string;
  mainCategory?: MainCategory;
} {
  const department = data.department;
  const mongoId = String(department._id ?? "");
  const name = String(department.name ?? "").trim();
  const nameAr = String(department.arabicName ?? name).trim();
  const intro = String(department.description ?? "").trim();
  const introAr = String(department.arabicDescription ?? "").trim();
  const image = typeof department.image === "string" ? department.image.trim() : "";

  const cat = department.catagory;
  let apiCategoryName = "";
  if (cat && typeof cat === "object" && cat !== null && "name" in cat) {
    apiCategoryName = String((cat as { name?: string }).name ?? "").trim();
  }
  const mainCategory = API_CATEGORY_TO_MAIN[apiCategoryName.trim().toUpperCase()];

  const slug = mongoId ? departmentSlug(name, mongoId) : fallbackSlug;

  const sections = mapContentBlocks(
    department.customExplainantions,
    "explaination",
    "arabicExplaination",
  );

  const subDepartments = data.subspecialities
    .map((sub) => {
      const subName = String(sub.name ?? "").trim();
      if (!subName) return null;
      const subMongoId = String(sub._id ?? "").trim();

      return {
        slug: subMongoId ? `${slugifySubName(subName)}-${subMongoId.slice(-6)}` : slugifySubName(subName),
        name: subName,
        nameAr: String(sub.arabicName ?? subName).trim(),
        intro: String(sub.description ?? "").trim(),
        introAr: String(sub.arabicDescription ?? "").trim(),
        sections: mapContentBlocks(sub.customSubspecialities, "explanations", "arabicExplanations"),
        subspecialityId: subMongoId || undefined,
      };
    })
    .filter((sub): sub is NonNullable<typeof sub> => sub !== null);

  const doctors = data.doctors.map((row) => mapApiDoctorRowToDoctor(row, name, nameAr));

  return {
    mongoId,
    image,
    doctors,
    mainCategory,
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
): NonNullable<import("@/types/department").Department["subs"]> {
  return subspecialities
    .map((sub) => {
      const name = String(sub.name ?? "").trim();
      if (!name) return null;
      return {
        name,
        nameAr: String(sub.arabicName ?? name).trim(),
        subspecialityId: String(sub._id ?? "").trim() || undefined,
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

function filterDoctorsBySubspeciality(doctors: Doctor[], subName: string): Doctor[] {
  const subKeywords = subName
    .toLowerCase()
    .split(/[\s&,/()+]+/)
    .filter((word) => word.length > 3);

  if (subKeywords.length === 0) return doctors;

  return doctors.filter((doc) => {
    const haystack = `${doc.title} ${doc.specialty} ${doc.titleAr} ${doc.specialtyAr} ${doc.id}`.toLowerCase();
    return subKeywords.some((keyword) => haystack.includes(keyword));
  });
}

export function filterDepartmentDoctors(
  doctors: Doctor[],
  departmentName: string,
  subName?: string,
): Doctor[] {
  const deptDoctors = doctors.filter(
    (doc) =>
      doc.department === departmentName ||
      doc.department.toLowerCase() === departmentName.toLowerCase(),
  );

  if (!subName) return deptDoctors;

  const filtered = filterDoctorsBySubspeciality(deptDoctors, subName);
  return filtered.length > 0 ? filtered : deptDoctors;
}
