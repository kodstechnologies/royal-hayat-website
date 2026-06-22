import { getDoctorDisplayName } from "@/utils/doctorDisplayName";

type DeptLike = { name?: string; nameAr?: string } | null | undefined;

type DoctorLike =
  | {
      name?: string;
      nameAr?: string;
      department?: string;
      departmentAr?: string;
      specialty?: string;
      specialtyAr?: string;
    }
  | null
  | undefined;

export const resolveAppointmentDoctorName = (
  doctor: DoctorLike,
  lang: "en" | "ar",
): string | undefined => {
  if (!doctor) return undefined;
  const display = getDoctorDisplayName(
    { name: doctor.name ?? "", nameAr: doctor.nameAr ?? doctor.name ?? "" },
    lang,
  ).trim();
  return display || doctor.name?.trim() || undefined;
};

export const resolveAppointmentDepartmentName = (
  dept: DeptLike,
  doctor: DoctorLike,
  lang: "en" | "ar",
): string | undefined => {
  if (lang === "ar") {
    const value =
      dept?.nameAr?.trim() ||
      doctor?.departmentAr?.trim() ||
      doctor?.specialtyAr?.trim() ||
      dept?.name?.trim() ||
      doctor?.department?.trim() ||
      doctor?.specialty?.trim();
    return value || undefined;
  }

  const value =
    dept?.name?.trim() ||
    doctor?.department?.trim() ||
    doctor?.specialty?.trim();
  return value || undefined;
};

export const resolvePrefilledAppointmentDoctorName = (
  prefill: { doctorName?: string; doctorNameAr?: string },
  lang: "en" | "ar",
): string | undefined => {
  const en = prefill.doctorName?.trim();
  const ar = prefill.doctorNameAr?.trim();
  if (lang === "ar") return ar || en || undefined;
  return en || ar || undefined;
};

export const resolvePrefilledAppointmentDepartmentName = (
  prefill: { departmentName?: string; departmentNameAr?: string },
  lang: "en" | "ar",
): string | undefined => {
  const en = prefill.departmentName?.trim();
  const ar = prefill.departmentNameAr?.trim();
  if (lang === "ar") return ar || en || undefined;
  return en || ar || undefined;
};
