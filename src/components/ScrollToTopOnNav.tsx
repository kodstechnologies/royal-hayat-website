import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEPT_LIST_PATHS = new Set(["/departments", "/medical-services"]);

const ScrollToTopOnNav = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as {
      restoreDeptOpenIndex?: number;
      fromDepartments?: boolean;
    } | null;

    const isRestoringDeptCard =
      state?.restoreDeptOpenIndex != null &&
      !state?.fromDepartments &&
      DEPT_LIST_PATHS.has(location.pathname);

    if (isRestoringDeptCard) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, location.key, location.state]);

  return null;
};
export default ScrollToTopOnNav;
