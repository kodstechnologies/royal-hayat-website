import api from "./axiosInstance";
import type { Doctor } from "@/data/doctors";
import type { DoctorWithClinicCode } from "@/data/doctorsWithClinicCodes";
import { departments as staticDepts, deptDoctorAliases } from "@/data/departments";
import { resolveDoctorArabicName } from "@/utils/doctorDisplayName";
import {
  parseDoctorDepartmentsFromApi,
  resolveDoctorDepartmentContext,
} from "@/utils/doctorDepartmentContext";

export const isMongoObjectId = (value?: string | null): value is string =>
  Boolean(value && /^[0-9a-fA-F]{24}$/.test(value));

const normalizeDoctorName = (name: string) =>
  name.toLowerCase().replace(/^dr\.?\s*/i, "").trim();

/** Resolve a doctor's MongoDB `_id` from provider code or display name. */
export async function resolveDoctorMongoId(opts: {
  mongoId?: string | null;
  providerCode?: string | null;
  name?: string | null;
}): Promise<string | null> {
  if (isMongoObjectId(opts.mongoId)) return opts.mongoId;

  const code = opts.providerCode?.trim();
  const targetName = opts.name ? normalizeDoctorName(opts.name) : "";

  if (!code && !targetName) return null;

  const doctors = await fetchAllActiveDoctors();

  if (code) {
    const byCode = doctors.find((d) => d.providerCode === code);
    if (byCode && isMongoObjectId(byCode.id)) return byCode.id;
  }

  if (targetName) {
    const byName = doctors.find((d) => normalizeDoctorName(d.name) === targetName);
    if (byName && isMongoObjectId(byName.id)) return byName.id;
  }

  return null;
}

/** Distinct department ObjectIds that have at least one active doctor. */
export async function getDoctorDepartmentIds(): Promise<string[]> {
  const res = await api.get("/api/v1/doctors/departments");
  const raw = res?.data?.data;
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
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

function flattenStructuredDoctorSections(
  sections: unknown,
  useArabic = false,
): string[] {
  if (!Array.isArray(sections)) return [];

  return sections.flatMap((item) => {
    if (typeof item === "string") return item.trim() ? [item.trim()] : [];
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const points = Array.isArray(useArabic ? obj.pointsAr : obj.points)
        ? ((useArabic ? obj.pointsAr : obj.points) as string[])
        : [];
      const heading = String(
        useArabic ? obj.subHeadingAr ?? "" : obj.subHeading ?? "",
      ).trim();
      return [
        ...(heading ? [heading.endsWith(":") ? heading : `${heading}:`] : []),
        ...points.map((point) => String(point).trim()).filter(Boolean),
      ];
    }
    return [];
  });
}

export function mapApiDoctorRowToDoctor(
  row: Record<string, unknown>,
  departmentNameEn: string,
  departmentNameAr: string,
  contextDepartmentId?: string,
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

  const parsedDepartments = parseDoctorDepartmentsFromApi(row.department);
  const departmentContext = resolveDoctorDepartmentContext(parsedDepartments, contextDepartmentId, {
    nameEn: departmentNameEn,
    nameAr: departmentNameAr,
  });

  const resolvedDeptEn = departmentContext.department;
  const resolvedDeptAr = departmentContext.departmentAr;
  const departmentId = departmentContext.departmentId;
  const departmentIds = departmentContext.departmentIds;

  const specialty = String(row.specialty ?? resolvedDeptEn ?? "");
  const specialtyAr = String(row.specialtyAr ?? resolvedDeptAr ?? specialty);

  const title = String(row.title ?? "");
  const titleAr = String(row.titleAr ?? title);
  const initialsRaw = String(row.initials ?? (name.replace(/^Dr\.?\s*/i, "").slice(0, 2) || "DR")).toUpperCase();

  const quals = flattenStructuredDoctorSections(row.qualifications);
  const qualsAr = flattenStructuredDoctorSections(row.qualifications, true);
  const exp = flattenStructuredDoctorSections(row.expertise);
  const expAr = flattenStructuredDoctorSections(row.expertise, true);
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
    ...(departmentIds.length > 0 ? { departmentIds } : {}),
    providerCode,
  };
}

export async function fetchMappedDoctorsBySubspeciality(
  subspecialityId: string,
  departmentNameEn: string,
  departmentNameAr: string,
  contextDepartmentId?: string,
): Promise<Doctor[]> {
  const rows = await getDoctorsBySubspeciality(subspecialityId, { limit: 100 });
  return rows.map((row) =>
    mapApiDoctorRowToDoctor(row, departmentNameEn, departmentNameAr, contextDepartmentId),
  );
}

/** Maps API doctor rows for BookAppointment (static dept ids + HIS clinic/provider codes). */
export function mapApiDoctorRowToBookingDoctor(
  row: Record<string, unknown>,
  departmentNameEn: string,
  departmentNameAr: string,
  contextDepartmentId?: string,
): DoctorWithClinicCode {
  const base = mapApiDoctorRowToDoctor(
    row,
    departmentNameEn,
    departmentNameAr,
    contextDepartmentId,
  );

  const depRaw = row.department;
  let apiClinicalCode: string | undefined;
  if (depRaw && typeof depRaw === "object" && depRaw !== null && !Array.isArray(depRaw)) {
    const d = depRaw as { departmentId?: string };
    if (typeof d.departmentId === "string" && d.departmentId.trim()) {
      apiClinicalCode = d.departmentId.trim();
    }
  }

  const staticDept =
    resolveStaticDepartment(departmentNameEn) ?? resolveStaticDepartment(base.department);
  const rowClinicCode =
    typeof row.clinicCode === "string" && row.clinicCode.trim() ? row.clinicCode.trim() : undefined;
  const departmentClinicCode = staticDept?.clinicCode ?? apiClinicalCode;
  const clinicCode = contextDepartmentId
    ? departmentClinicCode || rowClinicCode
    : rowClinicCode || departmentClinicCode;

  const bookingDepartmentId =
    contextDepartmentId ??
    (isMongoObjectId(base.departmentId) ? base.departmentId : undefined) ??
    (staticDept ? String(staticDept.id) : undefined);

  return {
    ...base,
    departmentId: bookingDepartmentId,
    providerCode: base.providerCode,
    departmentClinicCode,
    clinicCode,
    hideBooking: base.hideBooking,
  };
}

function mapDoctorRowWithDepartments(
  row: Record<string, unknown>,
  mapper: (row: Record<string, unknown>, nameEn: string, nameAr: string) => Doctor,
): Doctor {
  const parsed = parseDoctorDepartmentsFromApi(row.department);
  const first = parsed[0];
  const deptName = first?.name ?? "";
  const deptNameAr = first?.nameAr || first?.name || deptName;
  return mapper(row, deptName, deptNameAr);
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
      out.push(mapDoctorRowWithDepartments(row, mapApiDoctorRowToDoctor));
    }
    const totalPages = meta?.totalPages ?? page;
    if (page >= totalPages) break;
    page += 1;
  }
  return out;
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
      out.push(mapDoctorRowWithDepartments(row, mapApiDoctorRowToBookingDoctor));
    }
    const totalPages = meta?.totalPages ?? page;
    if (page >= totalPages) break;
    page += 1;
  }
  return out;
}

/** Featured doctors for the home / medical services carousel. */
export async function fetchFeaturedDoctors(): Promise<Doctor[]> {
  const res = await api.get("/api/v1/featured-doctors");
  const records = res?.data?.data;
  if (!Array.isArray(records)) return [];

  const out: Doctor[] = [];
  for (const record of records) {
    const doc = (record as { doctor?: unknown })?.doctor;
    if (!doc || typeof doc !== "object") continue;

    const row = doc as Record<string, unknown>;
    if (row.isActive === false) continue;

    out.push(mapDoctorRowWithDepartments(row, mapApiDoctorRowToDoctor));
  }
  return out;
}

export const getDoctorById = async (id: string) => {
  const response = await api.get(`/api/v1/doctors/${id}`);
  return response.data;
};

export function isMongoDoctorId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/** Single doctor profile from API (populated qualifications/expertise, flattened for UI). */
export async function fetchDoctorProfileById(
  id: string,
  context?: {
    departmentId?: string;
    departmentNameEn?: string;
    departmentNameAr?: string;
  },
): Promise<Doctor | null> {
  try {
    const res = await getDoctorById(id);
    const row = res?.data as Record<string, unknown> | undefined;
    if (!row || typeof row !== "object") return null;

    if (context?.departmentId) {
      const parsed = parseDoctorDepartmentsFromApi(row.department);
      const contextMatch = parsed.find((dept) => dept.id === context.departmentId);
      const first = parsed[0];
      const nameEn = context.departmentNameEn ?? contextMatch?.name ?? first?.name ?? "";
      const nameAr =
        context.departmentNameAr ??
        contextMatch?.nameAr ??
        first?.nameAr ??
        first?.name ??
        nameEn;
      return mapApiDoctorRowToDoctor(row, nameEn, nameAr, context.departmentId);
    }

    return mapDoctorRowWithDepartments(row, mapApiDoctorRowToDoctor);
  } catch {
    return null;
  }
}

/** All active doctors for the public /doctors listing. */
export async function fetchAllDoctorsByDepartment(): Promise<Doctor[]> {
  return fetchAllActiveDoctors();
}
