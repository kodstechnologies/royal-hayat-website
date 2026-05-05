import api from "./axiosInstance";

export type DepartmentListItem = {
  _id: string;
  name: string;
  isActive?: boolean;
  [key: string]: unknown;
};

export const getAllDepartments = async (params?: { page?: number; limit?: number; isActive?: boolean }) => {
  const response = await api.get("/api/v1/departments", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 100,
      ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
    },
  });
  const raw = response?.data?.data;
  return Array.isArray(raw) ? (raw as DepartmentListItem[]) : [];
};

export const getDepartmentById = async (id: string) => {
  const response = await api.get(`/api/v1/departments/${id}`);
  return response.data;
};

/** Fetch all pages (limit capped by API, typically 100 per page). */
export async function fetchAllDepartmentsPages(params?: { isActive?: boolean }): Promise<DepartmentListItem[]> {
  const out: DepartmentListItem[] = [];
  let page = 1;
  const limit = 100;
  for (;;) {
    const batch = await getAllDepartments({
      page,
      limit,
      ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
    });
    if (!batch.length) break;
    out.push(...batch);
    if (batch.length < limit) break;
    page += 1;
  }
  return out;
}
