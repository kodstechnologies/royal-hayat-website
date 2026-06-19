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

export type DepartmentSubspecialitiesDoctorsResponse = {
  success?: boolean;
  message?: string;
  data?: {
    department: Record<string, unknown>;
    subspecialities: Record<string, unknown>[];
    doctors: Record<string, unknown>[];
  };
};

/** Subspecialities and active doctors for a department (Mongo _id or departmentId code). */
export const getDepartmentSubspecialitiesAndDoctors = async (departmentId: string) => {
  const response = await api.get<DepartmentSubspecialitiesDoctorsResponse>(
    `/api/v1/departments/${encodeURIComponent(departmentId)}/subspecialities-doctors`,
  );
  return response.data;
};
export async function fetchAllDepartmentsPages(params?: { isActive?: boolean }): Promise<DepartmentListItem[]> {
  const out: DepartmentListItem[] = [];
  let page = 1;
  const limit = 100;

  for (;;) {
    const response = await api.get("/api/v1/departments", {
      params: {
        page,
        limit,
        ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
      },
    });
    const batch = Array.isArray(response?.data?.data)
      ? (response.data.data as DepartmentListItem[])
      : [];
    const meta = response?.data?.meta as { pages?: number } | undefined;
    const totalPages = meta?.pages ?? page;

    if (!batch.length) break;
    out.push(...batch);
    if (page >= totalPages || batch.length < limit) break;
    page += 1;
  }

  return out;
}
