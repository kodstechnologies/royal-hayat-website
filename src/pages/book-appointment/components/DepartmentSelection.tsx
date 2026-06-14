import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pageVariants } from "../types";
import { isAlSafwaDept, isHomeHealthDept } from "../utils";
import type { BookingDeptRow } from "../types";
type GroupedDepts = {
  key: string;
  label: string;
  labelAr: string;
  depts: BookingDeptRow[];
};
type DepartmentSelectionProps = {
  isAr: boolean;
  t: (key: string) => string;
  catalogError: string;
  deptSearch: string;
  setDeptSearch: (value: string) => void;
  catalogLoading: boolean;
  groupedDisplayDepts: GroupedDepts[];
  selectedDept: string | null;
  setSelectedDept: (id: string) => void;
  setStep: (step: number) => void;
  showAllDepts: boolean;
  setShowAllDepts: (value: boolean) => void;
  deptSearchTrimmed: boolean;
  filteredDeptsCount: number;
};
const DepartmentSelection = ({
  isAr,
  t,
  catalogError,
  deptSearch,
  setDeptSearch,
  catalogLoading,
  groupedDisplayDepts,
  selectedDept,
  setSelectedDept,
  setStep,
  showAllDepts,
  setShowAllDepts,
  deptSearchTrimmed,
  filteredDeptsCount,
}: DepartmentSelectionProps) => {
  const navigate = useNavigate();
  return (
    <motion.div
      key="s0"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35 }}
    >
      <div className="max-w-4xl mx-auto">
        {catalogError ? (
          <p className="text-center text-destructive font-body text-sm mb-4">{catalogError}</p>
        ) : null}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={deptSearch}
            onChange={(e) => setDeptSearch(e.target.value)}
            placeholder={t("searchDepartments")}
            disabled={catalogLoading}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-popover font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
        </div>
        {catalogLoading ? (
          <div className="py-16 text-center text-muted-foreground font-body text-sm">
            {isAr ? "جاري تحميل الأقسام…" : "Loading departments…"}
          </div>
        ) : (
          <div className="space-y-10">
            {groupedDisplayDepts.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-px flex-1 bg-border/50" />
                  <h3 className="text-xs sm:text-sm font-body font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-accent whitespace-nowrap px-1">
                    {isAr ? group.labelAr : group.label}
                  </h3>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {group.depts.map((dept) => (
                    <motion.button
                      key={dept.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isAlSafwaDept(dept)) {
                          navigate("/al-safwa", { state: { fromBookAppointment: true } });
                          return;
                        }
                        if (isHomeHealthDept(dept)) {
                          navigate("/home-health", { state: { fromBookAppointment: true } });
                          return;
                        }
                        setSelectedDept(dept.id);
                        setStep(1);
                      }}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        selectedDept === dept.id
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-popover border-border hover:border-accent/40 text-foreground"
                      }`}
                    >
                      <dept.icon
                        className={`w-5 h-5 flex-shrink-0 ${selectedDept === dept.id ? "" : "text-accent"}`}
                      />
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium truncate">
                          {isAr ? dept.nameAr : dept.name}
                        </p>
                        <p
                          className={`font-body text-xs ${
                            selectedDept === dept.id ? "text-primary-foreground/60" : "text-muted-foreground"
                          }`}
                        >
                          {dept.category}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {!showAllDepts && !deptSearchTrimmed && filteredDeptsCount > 6 && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setShowAllDepts(true)}
              className="px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase border border-border hover:border-accent/40 text-muted-foreground hover:text-foreground transition-all"
            >
              {isAr ? "عرض جميع الأقسام" : `View All (${filteredDeptsCount})`}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
export default DepartmentSelection;
