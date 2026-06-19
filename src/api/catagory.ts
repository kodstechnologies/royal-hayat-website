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
  subspecialities?: {
    _id?: string;
    name?: string;
    description?: string;
    customSubspecialities?: {
      _id?: string;
      heading?: string;
      subHeading?: string;
      arabicHeading?: string;
      arabicSubHeading?: string;
      explanations?: string[];
      arabicExplanations?: string[];
    }[];
  }[];
  subspeciality?: {
    _id?: string;
    name?: string;
    description?: string;
    customSubspecialities?: {
      _id?: string;
      heading?: string;
      subHeading?: string;
      arabicHeading?: string;
      arabicSubHeading?: string;
      explanations?: string[];
      arabicExplanations?: string[];
    }[];
  } | null;
  doctors?: ApiDoctorNested[];
  customExplainantions?: { _id?: string; heading?: string; subHeading?: string; explaination?: string[]; arabicHeading?: string; arabicSubHeading?: string; arabicExplaination?: string[] }[];
};
export type ApiCategoryWithNested = {
  _id: string;
  name: string;
  arabicName?: string;
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
      arabicName: String(row.arabicName ?? ""),
      departments: Array.isArray(deps) ? (deps as ApiDepartmentNested[]) : [],
    };
  });
}

/** Flatten categories → active department rows with populated `catagory` for display mapping. */
export function flattenCategoriesToDepartmentRows(
  categories: ApiCategoryWithNested[],
): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];

  for (const category of categories) {
    for (const department of category.departments ?? []) {
      if (department.isActive === false) continue;
      rows.push({
        ...department,
        catagory: {
          _id: category._id,
          name: category.name,
          arabicName: category.arabicName ?? "",
        },
      });
    }
  }

  return rows;
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
