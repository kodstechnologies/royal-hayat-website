import api from "./axiosInstance";

export type EmployeeRecognition = {
  _id?: string;
  employeeId: string;
  employeeID?: string;
  employeeName: string;
  employeeNameArabic?: string;
  department?: string;
  arabicDepartment?: string;
  title: string;
  arabicTitle?: string;
  achievements: string;
  arabicAchievements?: string;
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
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

export type EmployeeOfMonthDisplay = {
  key: string;
  name: string;
  nameAr: string;
  sectorAr: string;
  dept: string;
  deptAr: string;
  role: string;
  roleAr: string;
  image: string;
  achievements: string[];
  achievementsAr: string[];
};

export const mapEmployeeRecognitionToDisplay = (
  item: EmployeeRecognition,
): EmployeeOfMonthDisplay => ({
  key: item._id ?? item.employeeId,
  name: item.employeeName,
  nameAr: item.employeeNameArabic ?? item.employeeName,
  sectorAr: "",
  dept: item.department ?? "",
  deptAr: item.arabicDepartment ?? item.department ?? "",
  role: item.title,
  roleAr: item.arabicTitle ?? item.title,
  image: item.image ?? "",
  achievements: achievementsTextToLines(item.achievements),
  achievementsAr: achievementsTextToLines(
    item.arabicAchievements ?? item.achievements,
  ),
});
