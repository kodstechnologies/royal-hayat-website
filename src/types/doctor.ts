export interface Doctor {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  department: string;
  departmentAr: string;
  title: string;
  titleAr: string;
  bio: string;
  bioAr: string;
  qualifications: string[];
  qualificationsAr: string[];
  expertise: string[];
  expertiseAr: string[];
  languages: string[];
  languagesAr: string[];
  initials: string;
  color: string;
  symptoms: string[];
  availableOnline?: boolean;
  image?: string;
  hideBooking?: boolean;
  departmentId?: string;
  departmentIds?: string[];
  /** All departments from API (used for multi-department listing). */
  allDepartments?: { id: string; name: string; nameAr: string }[];
  providerCode?: string;
  clinicCode?: string;
}

export interface DoctorWithClinicCode extends Doctor {
  departmentClinicCode?: string;
}
