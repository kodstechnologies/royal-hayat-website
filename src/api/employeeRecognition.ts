import api from "./axiosInstance";

export type EmployeeRecognition = {
  _id?: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  title: string;
  achievements: string;
  image?: string;
  visibilityStatus: "show" | "hide";
  createdAt?: string;
  updatedAt?: string;
};

export type GetEmployeeRecognitionsParams = {
  visibilityStatus?: "show" | "hide";
  page?: number;
  limit?: number;
};

export const getAllEmployeeRecognitions = async (
  params: GetEmployeeRecognitionsParams = {},
): Promise<EmployeeRecognition[]> => {
  const response = await api.get("/api/v1/achievements", {
    params: {
      page: 1,
      limit: 100,
      visibilityStatus: "show",
      ...params,
    },
  });
  const data = response.data?.data;
  return Array.isArray(data) ? (data as EmployeeRecognition[]) : [];
};

export const achievementsTextToLines = (text: string): string[] =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
