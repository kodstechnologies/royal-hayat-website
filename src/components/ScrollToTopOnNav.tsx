import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readDoctorsPageRestore } from "@/utils/doctorsPageRestore";

const DEPT_LIST_PATHS = new Set(["/departments", "/medical-services"]);
const ScrollToTopOnNav = () => {
  const location = useLocation();
  useEffect(() => {
    const state = location.state as {
      restoreDeptOpenIndex?: number;
      restoreExpandedIndex?: number;
      restoreScrollY?: number;
      restoreDoctorId?: string;
      fromDepartments?: boolean;
      fromDoctors?: boolean;
    } | null;
    const isRestoringDeptCard =
      state?.restoreDeptOpenIndex != null &&
      !state?.fromDepartments &&
      DEPT_LIST_PATHS.has(location.pathname);
    const isRestoringSpecializedCare =
      location.pathname === "/" &&
      (state?.restoreExpandedIndex != null || typeof state?.restoreScrollY === "number");
    const isRestoringDoctorsPage =
      location.pathname === "/doctors" &&
      (typeof state?.restoreDoctorId === "string" ||
        Boolean(readDoctorsPageRestore()?.doctorId));
    if (isRestoringDeptCard || isRestoringSpecializedCare || isRestoringDoctorsPage) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, location.key, location.state]);
  return null;
};
export default ScrollToTopOnNav;