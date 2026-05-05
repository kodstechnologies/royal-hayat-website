import api from "./axiosInstance";

export type ApiDoctorNested = {
  _id: string;
  doctorId?: string;
  name: string;
  specialty?: string;
  title?: string;
  image?: string;
  initials?: string;
  isActive?: boolean;
  availableOnline?: boolean;
};

export type ApiDepartmentNested = {
  _id: string;
  departmentId?: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
  subSpecialties?: string[];
  subspecialityName?: string;
  /** Populated subspeciality documents (preferred; supports multiple per department). */
  subspecialities?: {
    _id?: string;
    name?: string;
    description?: string;
    customSubspecialities?: { subHeading?: string; explanations?: string[]; _id?: string }[];
  }[];
  /** First subspeciality (backward compatible with older API payloads). */
  subspeciality?: {
    _id?: string;
    name?: string;
    description?: string;
    customSubspecialities?: { subHeading?: string; explanations?: string[]; _id?: string }[];
  } | null;
  doctors?: ApiDoctorNested[];
  /** Populated department content blocks (`CustomExplainantion`). */
  customExplainantions?: { _id?: string; subHeading?: string; explaination?: string[] }[];
};

export type ApiCategoryWithNested = {
  _id: string;
  name: string;
  departments?: ApiDepartmentNested[];
};

function normalizeCategoriesPayload(body: unknown): ApiCategoryWithNested[] {
  if (!body || typeof body !== "object") return [];
  const o = body as Record<string, unknown>;
  const raw =
    Array.isArray(o.data)
      ? o.data
      : Array.isArray(o.categories)
        ? o.categories
        : Array.isArray(o.catagories)
          ? o.catagories
          : Array.isArray(body)
            ? (body as ApiCategoryWithNested[])
            : [];
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    const deps = row.departments ?? row.departmentList ?? [];
    return {
      _id: String(row._id ?? ""),
      name: String(row.name ?? ""),
      departments: Array.isArray(deps) ? (deps as ApiDepartmentNested[]) : [],
    };
  });
}

export const getCatagoriesWithDepartmentsAndDoctors = async (): Promise<ApiCategoryWithNested[]> => {
  const res = await api.get("/api/v1/catagories/with-departments-doctors");
  const payload = res?.data;
  if (typeof payload === "string" && payload.trimStart().toLowerCase().startsWith("<!")) {
    throw new Error(
      "Categories API returned HTML instead of JSON. In dev, restart Vite after vite.config proxy changes; ensure the backend is running (see VITE_BACKEND_API_URL).",
    );
  }
  return normalizeCategoriesPayload(payload);
};
