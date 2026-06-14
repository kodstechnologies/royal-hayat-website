import api from "./axiosInstance";
import type { Doctor } from "@/data/doctors";
import type { DoctorWithClinicCode } from "@/data/doctorsWithClinicCodes";
import { departments as staticDepts, deptDoctorAliases } from "@/data/departments";
import { resolveDoctorArabicName } from "@/utils/doctorDisplayName";

/** Departments that have at least one active doctor (with names). */
export async function getDoctorDepartmentsList(): Promise<
  { _id: string; name: string; arabicName?: string }[]
> {
  const res = await api.get("/api/v1/doctors/departments/list");
  const raw = res?.data?.data;
  if (!Array.isArray(raw)) return [];
  return raw as { _id: string; name: string; arabicName?: string }[];
}

/** Distinct department ObjectIds that have at least one active doctor. */
export async function getDoctorDepartmentIds(): Promise<string[]> {
  const depts = await getDoctorDepartmentsList();
  return depts.map((d) => d._id);
}

/** Active doctors for a single department (Mongo department `_id`). */
export async function getDoctorsByDepartment(department: string): Promise<Record<string, unknown>[]> {
  const res = await api.get(`/api/v1/doctors/department/${encodeURIComponent(department)}`);
  const raw = res?.data?.data;
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

/** Active doctors assigned this subspeciality on their profile (Mongo subspeciality `_id`). */
export async function getDoctorsBySubspeciality(
  subspecialityId: string,
  opts?: { page?: number; limit?: number },
): Promise<Record<string, unknown>[]> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 100;
  const res = await api.get(`/api/v1/doctors/subspeciality/${encodeURIComponent(subspecialityId)}`, {
    params: { page, limit },
  });
  const raw = res?.data?.data;
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

function parseAvailableOnline(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function isDoctorAvailableOnline(value: unknown): boolean {
  return parseAvailableOnline(value);
}

function resolveStaticDepartment(apiDeptName: string) {
  const normalized = apiDeptName.trim().toLowerCase();
  for (const dept of staticDepts) {
    const aliases = deptDoctorAliases[dept.name] ?? [dept.name];
    if (
      dept.name.toLowerCase() === normalized ||
      aliases.some((alias) => alias.toLowerCase() === normalized)
    ) {
      return dept;
    }
  }
  return undefined;
}

function flattenExpertiseFromApi(raw: unknown): { en: string[]; ar: string[] } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { en: [], ar: [] };
  }

  const en: string[] = [];
  const ar: string[] = [];

  for (const item of raw) {
    if (typeof item === "string") {
      const text = item.trim();
      if (text) en.push(text);
      continue;
    }

    if (!item || typeof item !== "object") continue;

    const obj = item as {
      subHeading?: string;
      subHeadingAr?: string;
      points?: unknown[];
      pointsAr?: unknown[];
    };

    const heading = String(obj.subHeading ?? "").trim();
    const headingAr = String(obj.subHeadingAr ?? "").trim();
    if (heading) {
      en.push(heading.endsWith(":") || heading.endsWith("：") ? heading : `${heading}:`);
    }
    if (headingAr) {
      ar.push(headingAr.endsWith(":") || headingAr.endsWith("：") ? headingAr : `${headingAr}:`);
    }

    for (const point of Array.isArray(obj.points) ? obj.points : []) {
      const text = String(point).trim();
      if (text) en.push(text);
    }
    for (const point of Array.isArray(obj.pointsAr) ? obj.pointsAr : []) {
      const text = String(point).trim();
      if (text) ar.push(text);
    }
  }

  return { en, ar };
}

const MONGO_OID = /^[0-9a-fA-F]{24}$/i;

export function isMongoDoctorId(id: string): boolean {
  return MONGO_OID.test(id.trim());
}

export function mapApiDoctorRowToDoctor(
  row: Record<string, unknown>,
  departmentNameEn: string,
  departmentNameAr: string,
): Doctor {
  const id = String(row._id ?? row.doctorId ?? "");
  const name = String(row.name ?? "");
  const providerCode =
    typeof row.doctorId === "string" && row.doctorId.trim() ? row.doctorId.trim() : undefined;
  const nameAr = resolveDoctorArabicName({
    id: providerCode ?? id,
    name,
    nameAr: String(row.nameAr ?? name),
  });

  const depRaw = row.department;
  let resolvedDeptEn = departmentNameEn;
  let resolvedDeptAr = departmentNameAr;
  let departmentId: string | undefined;

  if (depRaw && typeof depRaw === "object" && depRaw !== null) {
    const d = depRaw as {
      _id?: unknown;
      name?: string;
      nameAr?: string;
      arabicName?: string;
    };
    if (d._id != null) departmentId = String(d._id);
    if (typeof d.name === "string" && d.name.trim()) {
      resolvedDeptEn = d.name.trim();
    }
    if (typeof d.arabicName === "string" && d.arabicName.trim()) {
      resolvedDeptAr = d.arabicName.trim();
    } else if (typeof d.nameAr === "string" && d.nameAr.trim()) {
      resolvedDeptAr = d.nameAr.trim();
    }
  } else if (typeof depRaw === "string" && /^[0-9a-fA-F]{24}$/i.test(depRaw)) {
    departmentId = depRaw;
  }

  const subs = Array.isArray(row.subspecialities)
    ? (row.subspecialities as string[]).filter(Boolean)
    : [];
  const subsAr = Array.isArray(row.subspecialitiesAr)
    ? (row.subspecialitiesAr as string[]).filter(Boolean)
    : subs;

  const specialty = String(row.specialty ?? subs[0] ?? resolvedDeptEn ?? "");
  const specialtyAr = String(row.specialtyAr ?? subsAr[0] ?? resolvedDeptAr ?? specialty);

  const title = String(row.title ?? "");
  const titleAr = String(row.titleAr ?? title);
  const initialsRaw = String(row.initials ?? (name.replace(/^Dr\.?\s*/i, "").slice(0, 2) || "DR")).toUpperCase();

  const quals = Array.isArray(row.qualifications) ? (row.qualifications as string[]) : [];
  const qualsAr = Array.isArray(row.qualificationsAr) ? (row.qualificationsAr as string[]) : quals;

  const expertiseRaw = row.expertise;
  const flattenedExpertise = flattenExpertiseFromApi(expertiseRaw);
  const exp =
    flattenedExpertise.en.length > 0
      ? flattenedExpertise.en
      : Array.isArray(expertiseRaw)
        ? (expertiseRaw as string[]).filter((item) => typeof item === "string")
        : [];
  const expertiseArRaw = row.expertiseAr;
  const flattenedExpertiseAr = flattenExpertiseFromApi(expertiseArRaw);
  const expAr =
    flattenedExpertise.ar.length > 0
      ? flattenedExpertise.ar
      : flattenedExpertiseAr.en.length > 0
        ? flattenedExpertiseAr.en
        : Array.isArray(expertiseArRaw)
          ? (expertiseArRaw as string[]).filter((item) => typeof item === "string")
          : exp;
  const langs = Array.isArray(row.languages) ? (row.languages as string[]) : [];
  const langsAr = Array.isArray(row.languagesAr) ? (row.languagesAr as string[]) : langs;
  const symptoms = Array.isArray(row.symptoms) ? (row.symptoms as string[]) : [];
  const bio = String(row.bio ?? "");
  const bioAr = String(row.bioAr ?? bio);
  const image = typeof row.image === "string" ? row.image : "";
  const isActive = row.isActive !== false;

  return {
    id,
    name,
    nameAr,
    specialty,
    specialtyAr,
    department: resolvedDeptEn,
    departmentAr: resolvedDeptAr || resolvedDeptEn,
    title,
    titleAr,
    bio,
    bioAr,
    qualifications: quals,
    qualificationsAr: qualsAr,
    expertise: exp,
    expertiseAr: expAr,
    languages: langs,
    languagesAr: langsAr,
    initials: initialsRaw,
    color: typeof row.color === "string" ? row.color : "#4A1423",
    symptoms,
    image,
    availableOnline: parseAvailableOnline(row.availableOnline),
    hideBooking: !isActive,
    ...(departmentId ? { departmentId } : {}),
    providerCode,
  };
}

/** Maps API doctor rows for BookAppointment (static dept ids + HIS clinic/provider codes). */
export function mapApiDoctorRowToBookingDoctor(
  row: Record<string, unknown>,
  departmentNameEn: string,
  departmentNameAr: string,
): DoctorWithClinicCode {
  const base = mapApiDoctorRowToDoctor(row, departmentNameEn, departmentNameAr);

  const depRaw = row.department;
  let apiClinicalCode: string | undefined;
  if (depRaw && typeof depRaw === "object" && depRaw !== null) {
    const d = depRaw as { departmentId?: string };
    if (typeof d.departmentId === "string" && d.departmentId.trim()) {
      apiClinicalCode = d.departmentId.trim();
    }
  }

  const staticDept = resolveStaticDepartment(base.department);
  const rowClinicCode =
    typeof row.clinicCode === "string" && row.clinicCode.trim() ? row.clinicCode.trim() : undefined;
  const departmentClinicCode = staticDept?.clinicCode ?? apiClinicalCode;
  const clinicCode = rowClinicCode || departmentClinicCode;

  return {
    ...base,
    departmentId: staticDept ? String(staticDept.id) : base.departmentId,
    providerCode: base.providerCode,
    departmentClinicCode,
    clinicCode,
    hideBooking: base.hideBooking,
  };
}

/** All active doctors (paginates until complete). List endpoint populates `department`. */
export async function fetchAllActiveDoctors(): Promise<Doctor[]> {
  const out: Doctor[] = [];
  let page = 1;
  const limit = 100;
  for (;;) {
    const res = await api.get("/api/v1/doctors", {
      params: { page, limit, sortBy: "name", sortOrder: "asc" },
    });
    const rows = res?.data?.data as Record<string, unknown>[] | undefined;
    const meta = res?.data?.meta as { totalPages?: number } | undefined;
    if (!Array.isArray(rows) || rows.length === 0) break;
    for (const row of rows) {
      const dep = row.department;
      let deptName = "";
      let deptNameAr = "";
      if (dep && typeof dep === "object" && dep !== null && "name" in dep) {
        const d = dep as { name?: string; arabicName?: string; nameAr?: string };
        deptName = String(d.name ?? "");
        deptNameAr = String(d.arabicName ?? d.nameAr ?? deptName);
      }
      out.push(mapApiDoctorRowToDoctor(row, deptName, deptNameAr));
    }
    const totalPages = meta?.totalPages ?? page;
    if (page >= totalPages) break;
    page += 1;
  }
  return out;
}

/** Active doctors for every department returned by `/departments/list`. */
export async function fetchAllDoctorsByDepartment(): Promise<Doctor[]> {
  const departments = await getDoctorDepartmentsList();
  if (departments.length === 0) return [];

  const batches = await Promise.all(
    departments.map(async (dept) => {
      const rows = await getDoctorsByDepartment(dept._id);
      const deptNameAr = dept.arabicName?.trim() || dept.name;
      return rows.map((row) => mapApiDoctorRowToDoctor(row, dept.name, deptNameAr));
    }),
  );

  return batches.flat();
}

/** Active doctors mapped for BookAppointment (static department ids + booking codes). */
export async function fetchAllBookingDoctors(): Promise<DoctorWithClinicCode[]> {
  const out: DoctorWithClinicCode[] = [];
  let page = 1;
  const limit = 100;
  for (;;) {
    const res = await api.get("/api/v1/doctors", {
      params: { page, limit, sortBy: "name", sortOrder: "asc" },
    });
    const rows = res?.data?.data as Record<string, unknown>[] | undefined;
    const meta = res?.data?.meta as { totalPages?: number } | undefined;
    if (!Array.isArray(rows) || rows.length === 0) break;
    for (const row of rows) {
      const dep = row.department;
      let deptName = "";
      let deptNameAr = "";
      if (dep && typeof dep === "object" && dep !== null && "name" in dep) {
        const d = dep as { name?: string; arabicName?: string; nameAr?: string };
        deptName = String(d.name ?? "");
        deptNameAr = String(d.arabicName ?? d.nameAr ?? deptName);
      }
      out.push(mapApiDoctorRowToBookingDoctor(row, deptName, deptNameAr));
    }
    const totalPages = meta?.totalPages ?? page;
    if (page >= totalPages) break;
    page += 1;
  }
  return out;
}

export const getDoctorById = async (id: string) => {
  const response = await api.get(`/api/v1/doctors/${id}`);
  return response.data;
};

/** Loads a single doctor profile from GET /api/v1/doctors/:id. */
export async function fetchDoctorProfileById(id: string): Promise<Doctor | null> {
  if (!isMongoDoctorId(id)) return null;
  try {
    const res = await getDoctorById(id);
    if (res?.success && res.data) {
      return mapApiDoctorRowToDoctor(res.data as Record<string, unknown>, "", "");
    }
  } catch {
    return null;
  }
  return null;
};
