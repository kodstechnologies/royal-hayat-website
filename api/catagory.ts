import api from "./axiosInstance";

const BASE = "/api/v1/catagories";

export type CatagoryDoctor = {
  _id: string;
  doctorId: string;
  name: string;
  specialty?: string;
  title?: string;
  department?: string;
  image?: string;
  isActive?: boolean;
  availableOnline?: boolean;
  initials?: string;
};

export type CatagoryDepartment = {
  _id: string;
  departmentId: string;
  name: string;
  description: string;
  image?: string;
  subSpecialties?: string[];
  isActive?: boolean;
  order?: number;
  doctors: CatagoryDoctor[];
};

export type CatagoryWithDepartmentsAndDoctors = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  departments: CatagoryDepartment[];
};

/** GET /api/v1/catagories/with-departments-doctors — full tree: categories → departments → doctors */
export const getCatagoriesWithDepartmentsAndDoctors = async (): Promise<CatagoryWithDepartmentsAndDoctors[]> => {
  const response = await api.get(`${BASE}/with-departments-doctors`);
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
};
