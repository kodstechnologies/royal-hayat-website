import type { LucideIcon } from "lucide-react";

export type MainCategory =
  | "Clinical Speciality"
  | "Clinical Support Service"
  | "Home Care Service";

export interface Department {
  id: number;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  img: string;
  slug: string;
  icon: LucideIcon;
  category: string;
  clinicCode?: string;
  mainCategory?: MainCategory;
  mongoId?: string;
  medicalField?: string;
  medicalFieldAr?: string;
  order?: number;
  subs?: {
    name: string;
    nameAr: string;
    subspecialityId?: string;
    description?: string;
    customBlocks?: { subHeading?: string; explanations: string[] }[];
  }[];
  departmentContentBlocks?: { subHeading?: string; explanations: string[] }[];
}

export const MAIN_CATEGORIES: {
  key: MainCategory;
  label: string;
  labelAr: string;
}[] = [
  { key: "Clinical Speciality", label: "Clinical Speciality", labelAr: "التخصصات الطبية" },
  { key: "Clinical Support Service", label: "Clinical Support Service", labelAr: "الخدمات الطبية الداعمة" },
  { key: "Home Care Service", label: "Home Care Service", labelAr: "خدمات الرعاية المنزلية" },
];
