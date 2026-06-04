import type { LucideIcon } from "lucide-react";
export type BookingDeptRow = {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  slug: string;
  specialityCode?: string;
  mainCategory: string;
  icon: LucideIcon;
};
export type VerifiedIdentityDetails = {
  name: string;
  dateOfBirth: string;
  civilIdNumber: string;
  nationality: string;
  gender: string;
  passportNumber: string;
};
export const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};
