import { motion } from "framer-motion";
import { Sparkles, Stethoscope } from "lucide-react";
import { BackArrow } from "@/components/BackArrow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import type { BookingDeptRow } from "../types";
type RecommendedDepartmentsProps = {
  lang: string;
  isAr: boolean;
  t: (key: string) => string;
  symptomResults: string[];
  departmentsList: BookingDeptRow[];
  selectedDept: string | null;
  onSelectDepartment: (deptId: string) => void;
  onBack: () => void;
};
const RecommendedDepartments = ({
  lang,
  isAr,
  t,
  symptomResults,
  departmentsList,
  selectedDept,
  onSelectDepartment,
  onBack,
}: RecommendedDepartmentsProps) => (
  <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
    <Header />
    <div className="container mx-auto px-6 py-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-2xl font-serif text-foreground mb-2">
          {lang === "ar" ? "الأقسام الموصى بها" : "Recommended Departments"}
        </h2>
        <p className="text-muted-foreground font-body text-xs">
          {lang === "ar"
            ? "بناءً على أعراضك، نوصي بالأقسام التالية"
            : "Based on your symptoms, we recommend these departments"}
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {symptomResults.map((id) => {
          const dept = departmentsList.find((d) => d.id === id);
          if (!dept) return null;
          return (
            <motion.button
              key={dept.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDepartment(dept.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                selectedDept === dept.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-popover border-border hover:border-accent text-foreground"
              }`}
            >
              <Stethoscope className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-body text-sm font-medium">{dept.name}</p>
                <p className="font-body text-xs text-accent">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {lang === "ar" ? "توصية ذكية" : "AI Match"}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="flex items-center justify-start mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-foreground transition-colors"
        >
          <BackArrow className="w-4 h-4" /> {t("previous")}
        </button>
      </div>
    </div>
    <Footer />
    <ScrollToTop />
  </div>
);
export default RecommendedDepartments;
