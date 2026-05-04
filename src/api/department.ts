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
