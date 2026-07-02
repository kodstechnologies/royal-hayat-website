const OID = /^[0-9a-fA-F]{24}$/i;

export function resolveNavDepartmentContext(state: unknown): {
  departmentId?: string;
  departmentNameEn?: string;
  departmentNameAr?: string;
} {
  const s = state as Record<string, unknown> | null;
  if (!s) return {};

  const pickMongoId = (value: unknown): string | undefined =>
    typeof value === "string" && OID.test(value.trim()) ? value.trim() : undefined;

  const departmentId =
    pickMongoId(s.selectedDept) ??
    pickMongoId(s.contextDepartmentId) ??
    pickMongoId(s.departmentMongoId);

  return {
    departmentId,
    departmentNameEn:
      typeof s.contextDepartmentName === "string" ? s.contextDepartmentName.trim() : undefined,
    departmentNameAr:
      typeof s.contextDepartmentNameAr === "string" ? s.contextDepartmentNameAr.trim() : undefined,
  };
}

export type ParsedDoctorDepartment = {
  id: string;
  name: string;
  nameAr: string;
};

export function parseDoctorDepartmentsFromApi(depRaw: unknown): ParsedDoctorDepartment[] {
  if (depRaw == null) return [];

  const items = Array.isArray(depRaw) ? depRaw : [depRaw];
  const departments: ParsedDoctorDepartment[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (typeof item === "string" && OID.test(item)) {
      if (seen.has(item)) continue;
      seen.add(item);
      departments.push({ id: item, name: "", nameAr: "" });
      continue;
    }

    if (!item || typeof item !== "object") continue;

    const d = item as {
      _id?: unknown;
      name?: string;
      arabicName?: string;
      nameAr?: string;
    };

    if (d._id == null) continue;

    const id = String(d._id);
    if (seen.has(id)) continue;
    seen.add(id);

    departments.push({
      id,
      name: String(d.name ?? "").trim(),
      nameAr: String(d.arabicName ?? d.nameAr ?? d.name ?? "").trim(),
    });
  }

  return departments;
}

export function resolveDoctorDepartmentContext(
  parsed: ParsedDoctorDepartment[],
  contextDepartmentId?: string,
  fallbacks?: { nameEn: string; nameAr: string },
) {
  const fallbackEn = fallbacks?.nameEn?.trim() ?? "";
  const fallbackAr = fallbacks?.nameAr?.trim() || fallbackEn;
  const departmentIds = parsed.map((dept) => dept.id);

  if (contextDepartmentId) {
    const match = parsed.find((dept) => dept.id === contextDepartmentId);
    if (match) {
      return {
        departmentId: match.id,
        department: match.name || fallbackEn,
        departmentAr: match.nameAr || match.name || fallbackAr,
        departmentIds: departmentIds.length > 0 ? departmentIds : [contextDepartmentId],
      };
    }

    return {
      departmentId: contextDepartmentId,
      department: fallbackEn,
      departmentAr: fallbackAr,
      departmentIds: departmentIds.length > 0 ? departmentIds : [contextDepartmentId],
    };
  }

  const first = parsed[0];
  if (first) {
    return {
      departmentId: first.id,
      department: first.name || fallbackEn,
      departmentAr: first.nameAr || first.name || fallbackAr,
      departmentIds,
    };
  }

  return {
    departmentId: undefined as string | undefined,
    department: fallbackEn,
    departmentAr: fallbackAr,
    departmentIds,
  };
}

type DoctorDepartmentLabelSource = {
  department?: string;
  departmentAr?: string;
  specialty?: string;
  specialtyAr?: string;
  departmentId?: string;
  departmentIds?: string[];
};

type DepartmentLabelRow = {
  id: string;
  name: string;
  nameAr: string;
};

export function resolveDoctorDepartmentLabel(
  doc: DoctorDepartmentLabelSource,
  contextDepartmentId: string | null | undefined,
  departmentsList: DepartmentLabelRow[],
  lang: "en" | "ar",
): string {
  if (contextDepartmentId) {
    const fromCatalog = departmentsList.find((dept) => dept.id === contextDepartmentId);
    if (fromCatalog) {
      return lang === "ar" ? fromCatalog.nameAr || fromCatalog.name : fromCatalog.name;
    }
  }

  if (
    contextDepartmentId &&
    doc.departmentId === contextDepartmentId &&
    (lang === "ar" ? doc.departmentAr : doc.department)
  ) {
    return lang === "ar"
      ? doc.departmentAr || doc.department || doc.specialtyAr || doc.specialty || ""
      : doc.department || doc.specialty || "";
  }

  return lang === "ar"
    ? doc.departmentAr || doc.specialtyAr || doc.department || doc.specialty || ""
    : doc.department || doc.specialty || "";
}

export function resolveDoctorDepartmentId(
  doc: DoctorDepartmentLabelSource,
  contextDepartmentId?: string | null,
  departmentsList: DepartmentLabelRow[] = [],
): string | null {
  if (contextDepartmentId) {
    if (doc.departmentIds?.includes(contextDepartmentId)) return contextDepartmentId;
    if (doc.departmentId === contextDepartmentId) return contextDepartmentId;
    return contextDepartmentId;
  }

  if (doc.departmentId) return doc.departmentId;
  if (doc.departmentIds?.length === 1) return doc.departmentIds[0];
  if (doc.departmentIds?.length) return doc.departmentIds[0];

  const byName = departmentsList.find(
    (dept) => dept.name.toLowerCase() === String(doc.department ?? "").toLowerCase(),
  );
  return byName?.id ?? null;
}
