export type DoctorsPageRestore = {
  scrollY: number;
  doctorId: string;
  dept: string;
  searchQuery?: string;
};

export type DoctorsProfileNavState = DoctorsPageRestore & {
  fromDoctors: true;
  returnPath: "/doctors";
  restoreScrollY: number;
  restoreDoctorId: string;
  restoreSearchQuery?: string;
  contextDepartmentId?: string;
  contextDepartmentName?: string;
  contextDepartmentNameAr?: string;
};

type DoctorLike = {
  id: string;
  department?: string;
  departmentAr?: string;
  departmentId?: string;
  specialty?: string;
};

const STORAGE_KEY = "royale-hayat-doctors-restore";

export const buildDoctorsProfileNavState = (
  doctor: Pick<DoctorLike, "id" | "department" | "departmentAr" | "departmentId" | "specialty">,
  searchQuery = "",
): DoctorsProfileNavState => {
  const dept = doctor.department || doctor.specialty || "General";
  const scrollY = window.scrollY;
  const trimmedSearch = searchQuery.trim();

  return {
    fromDoctors: true,
    returnPath: "/doctors",
    restoreScrollY: scrollY,
    restoreDoctorId: doctor.id,
    restoreSearchQuery: trimmedSearch || undefined,
    scrollY,
    doctorId: doctor.id,
    dept,
    searchQuery: trimmedSearch || undefined,
    ...(doctor.departmentId ? { contextDepartmentId: doctor.departmentId } : {}),
    ...(doctor.department ? { contextDepartmentName: doctor.department } : {}),
    ...(doctor.departmentAr ? { contextDepartmentNameAr: doctor.departmentAr } : {}),
  };
};

export const saveDoctorsPageRestore = (data: DoctorsPageRestore) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private mode */
  }
};

export const readDoctorsPageRestore = (): DoctorsPageRestore | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DoctorsPageRestore;
    if (!parsed?.doctorId) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearDoctorsPageRestore = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

export const resolveDoctorsPageRestore = (
  locationState: Partial<DoctorsPageRestore> & {
    restoreDoctorId?: string;
    restoreScrollY?: number;
    restoreSearchQuery?: string;
  } | null | undefined,
): DoctorsPageRestore | null => {
  if (locationState?.restoreDoctorId || locationState?.doctorId) {
    return {
      doctorId: locationState.restoreDoctorId ?? locationState.doctorId ?? "",
      dept: locationState.dept ?? "General",
      scrollY:
        typeof locationState.restoreScrollY === "number"
          ? locationState.restoreScrollY
          : typeof locationState.scrollY === "number"
            ? locationState.scrollY
            : 0,
      searchQuery: locationState.restoreSearchQuery ?? locationState.searchQuery,
    };
  }

  return readDoctorsPageRestore();
};
