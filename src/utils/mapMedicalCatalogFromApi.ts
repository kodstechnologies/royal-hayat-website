import { Stethoscope } from "lucide-react";
import type { Department } from "@/data/departments";
import type { Doctor } from "@/data/doctors";
import type { ApiCategoryWithNested, ApiDoctorNested, ApiDepartmentNested } from "@/api/catagory";

const PLACEHOLDER_DEPT_IMG =
  "/placeholder.svg";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type DepartmentWithEmbeddedDoctors = Department & {
  embeddedDoctors?: Doctor[];
  /** Mongo `_id` of the department (for client-side filtering, e.g. subspeciality doctor lists). */
  apiDepartmentId?: string;
};

/** One API category with its departments (for Medical Services layout). */
export type MedicalCategoryGroup = {
  _id: string;
  name: string;
  departments: DepartmentWithEmbeddedDoctors[];
};

function mapApiDoctorToDoctor(d: ApiDoctorNested): Doctor {
  const spec = d.specialty || "";
  const title = d.title || "";
  const initialsRaw = (d.initials || d.name.replace(/^Dr\.?\s*/i, "").slice(0, 2) || "DR").toUpperCase();
  return {
    id: d._id,
    name: d.name,
    nameAr: d.name,
    specialty: spec,
    specialtyAr: spec,
    department: "",
    departmentAr: "",
    title,
    titleAr: title,
    bio: "",
    bioAr: "",
    qualifications: [],
    qualificationsAr: [],
    expertise: [],
    expertiseAr: [],
    languages: [],
    languagesAr: [],
    initials: initialsRaw,
    color: "#4A1423",
    symptoms: [],
    image: d.image || "",
    hideBooking: d.isActive === false,
    availableOnline: d.availableOnline,
  };
}

/** Populated `CustomExplainantion` on department (field name `explaination` in API). */
export function parseDepartmentContentBlocksFromApi(
  raw: unknown,
): { subHeading?: string; explanations: string[] }[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: { subHeading?: string; explanations: string[] }[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const o = c as Record<string, unknown>;
    const subHeading = typeof o.subHeading === "string" ? o.subHeading.trim() : "";
    const exp = o.explaination ?? o.explanations;
    const explanations = Array.isArray(exp) ? exp.map((x) => String(x).trim()).filter(Boolean) : [];
    if (!subHeading && explanations.length === 0) continue;
    out.push({
      ...(subHeading ? { subHeading } : {}),
      explanations,
    });
  }
  return out.length > 0 ? out : undefined;
}

function parseCustomBlocksFromApi(raw: unknown): { subHeading?: string; explanations: string[] }[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: { subHeading?: string; explanations: string[] }[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const o = c as Record<string, unknown>;
    const subHeading = typeof o.subHeading === "string" ? o.subHeading.trim() : "";
    const explanations = Array.isArray(o.explanations)
      ? o.explanations.map((x) => String(x).trim()).filter(Boolean)
      : [];
    if (!subHeading && explanations.length === 0) continue;
    out.push({
      ...(subHeading ? { subHeading } : {}),
      explanations,
    });
  }
  return out.length > 0 ? out : undefined;
}

function mapDepartment(dep: ApiDepartmentNested, seq: number, categoryName: string): DepartmentWithEmbeddedDoctors {
  const baseSlug = slugify(dep.name);
  const slug = `${baseSlug}-${String(dep._id).slice(-6)}`;
  const desc = dep.description?.trim() || "";
  const doctors = (dep.doctors || [])
    .filter((doc) => doc.isActive !== false)
    .map(mapApiDoctorToDoctor);

  const populatedFromApi = (() => {
    const fromArr = Array.isArray(dep.subspecialities)
      ? dep.subspecialities.filter((s): s is { _id?: string; name?: string } => Boolean(s && typeof s === "object"))
      : [];
    const legacy =
      dep.subspeciality && typeof dep.subspeciality === "object"
        ? [dep.subspeciality as { _id?: string; name?: string }]
        : [];
    const merged: { _id?: string; name?: string }[] = [...fromArr];
    for (const L of legacy) {
      const id = L._id ? String(L._id) : "";
      if (!id || merged.some((m) => String(m._id || "") === id)) continue;
      merged.push(L);
    }
    return merged;
  })();

  const subsOut: { name: string; nameAr: string; subspecialityId?: string }[] = [];
  const seen = new Set<string>();

  const attachIdForName = (name: string, id?: string) => {
    const key = name.trim().toLowerCase();
    if (!key || !id) return;
    const idx = subsOut.findIndex((x) => x.name.toLowerCase() === key);
    if (idx >= 0 && !subsOut[idx].subspecialityId) {
      subsOut[idx] = { ...subsOut[idx], subspecialityId: id };
    }
  };

  for (const s of dep.subSpecialties || []) {
    if (typeof s === "string" && s.trim()) {
      const name = s.trim();
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const match = populatedFromApi.find((p) => (p.name || "").trim().toLowerCase() === key);
      subsOut.push({
        name,
        nameAr: name,
        ...(match?._id ? { subspecialityId: String(match._id) } : {}),
      });
    }
  }

  for (const p of populatedFromApi) {
    const name = (p.name || "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    const id = p._id ? String(p._id) : undefined;
    if (seen.has(key)) {
      attachIdForName(name, id);
      continue;
    }
    seen.add(key);
    subsOut.push({
      name,
      nameAr: name,
      ...(id ? { subspecialityId: id } : {}),
    });
  }

  const subsFromSingle = dep.subspecialityName?.trim() || "";
  if (subsFromSingle) {
    const key = subsFromSingle.toLowerCase();
    const match = populatedFromApi.find((p) => (p.name || "").trim().toLowerCase() === key);
    const id = match?._id ? String(match._id) : undefined;
    if (!seen.has(key)) {
      seen.add(key);
      subsOut.push({
        name: subsFromSingle,
        nameAr: subsFromSingle,
        ...(id ? { subspecialityId: id } : {}),
      });
    } else {
      attachIdForName(subsFromSingle, id);
    }
  }

  const departmentContentBlocks = parseDepartmentContentBlocksFromApi(dep.customExplainantions);

  const subsEnriched = subsOut.map((entry) => {
    const match = populatedFromApi.find(
      (x) => (x.name || "").trim().toLowerCase() === entry.name.trim().toLowerCase(),
    );
    if (!match) return entry;
    const rec = match as Record<string, unknown>;
    const description = typeof rec.description === "string" ? rec.description.trim() : "";
    const customBlocks = parseCustomBlocksFromApi(rec.customSubspecialities);
    return {
      ...entry,
      ...(description ? { description } : {}),
      ...(customBlocks && customBlocks.length > 0 ? { customBlocks } : {}),
    };
  });

  return {
    id: 500000 + seq,
    name: dep.name,
    nameAr: dep.name,
    desc: desc || dep.name,
    descAr: desc || dep.name,
    img: dep.image?.trim() || PLACEHOLDER_DEPT_IMG,
    slug,
    icon: Stethoscope,
    category: categoryName,
    subs: subsEnriched,
    embeddedDoctors: doctors,
    apiDepartmentId: String(dep._id),
    ...(departmentContentBlocks && departmentContentBlocks.length > 0 ? { departmentContentBlocks } : {}),
  };
}

export function mapCategoriesToMedicalDepartments(categories: ApiCategoryWithNested[]): DepartmentWithEmbeddedDoctors[] {
  const out: DepartmentWithEmbeddedDoctors[] = [];
  let seq = 0;
  for (const cat of categories) {
    for (const dep of cat.departments || []) {
      if (dep.isActive === false) continue;
      out.push(mapDepartment(dep, seq++, cat.name || ""));
    }
  }
  return out;
}

/** Categories as sections: each item is a category name + its departments only. */
export function mapCategoriesToGroupedMedicalDepartments(categories: ApiCategoryWithNested[]): MedicalCategoryGroup[] {
  let seq = 0;
  return categories.map((cat) => {
    const departments: DepartmentWithEmbeddedDoctors[] = [];
    for (const dep of cat.departments || []) {
      if (dep.isActive === false) continue;
      departments.push(mapDepartment(dep, seq++, cat.name || ""));
    }
    return {
      _id: String(cat._id),
      name: cat.name || "",
      departments,
    };
  });
}

export function collectFeaturedDoctorsFromDepartments(
  depts: DepartmentWithEmbeddedDoctors[],
  limit: number,
): Doctor[] {
  const seen = new Set<string>();
  const list: Doctor[] = [];
  for (const d of depts) {
    for (const doc of d.embeddedDoctors || []) {
      if (seen.has(doc.id)) continue;
      seen.add(doc.id);
      list.push(doc);
      if (list.length >= limit) return list;
    }
  }
  return list;
}

export function collectFeaturedDoctorsFromGrouped(
  groups: MedicalCategoryGroup[],
  limit: number,
): Doctor[] {
  return collectFeaturedDoctorsFromDepartments(groups.flatMap((g) => g.departments), limit);
}
