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
  achievementType?: "month" | "quarter";
  image?: string;
  date?: string;
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

export const DEFAULT_EMPLOYEE_IMAGE = "/images/default-employee-avatar.svg";

export const getEmployeeImageSrc = (image?: string) =>
  image?.trim() || DEFAULT_EMPLOYEE_IMAGE;

export const formatEmployeeMonthYear = (
  dateStr: string | undefined,
  isAr: boolean,
): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(isAr ? "ar-KW" : "en-US", {
    month: "long",
    year: "numeric",
  });
};

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
  date?: string;
  achievementType: "month" | "quarter";
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
  image: getEmployeeImageSrc(item.image),
  date: item.date ?? item.createdAt,
  achievementType: item.achievementType ?? "month",
  achievements: achievementsTextToLines(item.achievements),
  achievementsAr: achievementsTextToLines(
    item.arabicAchievements ?? item.achievements,
  ),
});
