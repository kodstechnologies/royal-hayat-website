import api from "./axiosInstance";
import type { Doctor } from "@/data/doctors";

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

export function mapApiDoctorRowToDoctor(
  row: Record<string, unknown>,
  departmentNameEn: string,
  departmentNameAr: string,
): Doctor {
  const id = String(row._id ?? row.doctorId ?? "");
  const name = String(row.name ?? "");
  const nameAr = String(row.nameAr ?? name);
  const specialty = String(row.specialty ?? "");
  const specialtyAr = String(row.specialtyAr ?? specialty);
  const title = String(row.title ?? "");
  const titleAr = String(row.titleAr ?? title);
  const initialsRaw = String(row.initials ?? (name.replace(/^Dr\.?\s*/i, "").slice(0, 2) || "DR")).toUpperCase();
  const quals = Array.isArray(row.qualifications) ? (row.qualifications as string[]) : [];
  const qualsAr = Array.isArray(row.qualificationsAr) ? (row.qualificationsAr as string[]) : quals;
  const exp = Array.isArray(row.expertise) ? (row.expertise as string[]) : [];
  const expAr = Array.isArray(row.expertiseAr) ? (row.expertiseAr as string[]) : exp;
  const langs = Array.isArray(row.languages) ? (row.languages as string[]) : [];
  const langsAr = Array.isArray(row.languagesAr) ? (row.languagesAr as string[]) : langs;
  const symptoms = Array.isArray(row.symptoms) ? (row.symptoms as string[]) : [];
  const bio = String(row.bio ?? "");
  const bioAr = String(row.bioAr ?? bio);
  const image = typeof row.image === "string" ? row.image : "";
  const isActive = row.isActive !== false;

  const depRaw = row.department;
  let resolvedDeptEn = departmentNameEn;
  let resolvedDeptAr = departmentNameAr;
  let departmentId: string | undefined;
  if (depRaw && typeof depRaw === "object" && depRaw !== null) {
    const d = depRaw as { _id?: unknown; name?: string };
    if (d._id != null) departmentId = String(d._id);
    if (typeof d.name === "string" && d.name.trim()) {
      resolvedDeptEn = d.name.trim();
      resolvedDeptAr = resolvedDeptAr || resolvedDeptEn;
    }
  } else if (typeof depRaw === "string" && /^[0-9a-fA-F]{24}$/i.test(depRaw)) {
    departmentId = depRaw;
  }

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
    availableOnline: row.availableOnline === true,
    hideBooking: !isActive,
    ...(departmentId ? { departmentId } : {}),
    providerCode: typeof row.doctorId === "string" ? row.doctorId : undefined,
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
        deptName = String((dep as { name?: string }).name ?? "");
        deptNameAr = deptName;
      }
      out.push(mapApiDoctorRowToDoctor(row, deptName, deptNameAr));
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
