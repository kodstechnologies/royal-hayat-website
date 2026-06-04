import { motion } from "framer-motion";
import { CheckCircle2, Search, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DoctorWithClinicCode as Doctor } from "@/data/doctorsWithClinicCodes";
import { pageVariants } from "../types";
type DoctorSelectionProps = {
  isAr: boolean;
  lang: string;
  catalogError: string;
  doctorSearch: string;
  setDoctorSearch: (value: string) => void;
  setShowAllDoctors: (value: boolean) => void;
  catalogLoading: boolean;
  bookingPath: "primary" | "doctor" | "symptoms" | null;
  deptDoctorLoading: boolean;
  bookingPathDoctor: boolean;
  filteredAllDoctors: Doctor[];
  doctors: Doctor[];
  showAllDoctors: boolean;
  doctorSearchTrimmed: boolean;
  selectedDoctor: string | null;
  selectedDept: string | null;
  step: number;
  resolveDeptIdForDoctor: (doc: Doctor) => string | null;
};
const DoctorSelection = ({
  isAr,
  lang,
  catalogError,
  doctorSearch,
  setDoctorSearch,
  setShowAllDoctors,
  catalogLoading,
  bookingPath,
  deptDoctorLoading,
  bookingPathDoctor,
  filteredAllDoctors,
  doctors,
  showAllDoctors,
  doctorSearchTrimmed,
  selectedDoctor,
  selectedDept,
  step,
  resolveDeptIdForDoctor,
}: DoctorSelectionProps) => {
  const navigate = useNavigate();
  const docList = bookingPathDoctor ? filteredAllDoctors : doctors;
  const displayList = showAllDoctors || doctorSearchTrimmed ? docList : docList.slice(0, 6);
  return (
    <motion.div
      key="s1"
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
            value={doctorSearch}
            onChange={(e) => {
              setDoctorSearch(e.target.value);
              setShowAllDoctors(true);
            }}
            placeholder={lang === "ar" ? "ابحث عن طبيب..." : "Search for a doctor..."}
            disabled={catalogLoading || (bookingPath === "primary" && deptDoctorLoading)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-popover font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
        </div>
        {catalogLoading || (bookingPath === "primary" && deptDoctorLoading) ? (
          <div className="py-16 text-center text-muted-foreground font-body text-sm">
            {isAr ? "جاري تحميل الأطباء…" : "Loading doctors…"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayList.map((doc) => (
                <motion.div
                  key={doc.id}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }}
                  className={`relative rounded-2xl border flex flex-col cursor-pointer transition-all duration-300 overflow-hidden ${
                    selectedDoctor === doc.id ? "border-primary shadow-md" : "border-border/50 hover:border-accent/40"
                  }`}
                  onClick={() => {
                    const resolvedDeptId = selectedDept ?? resolveDeptIdForDoctor(doc);
                    navigate(`/doctors/${doc.id}`, {
                      state: {
                        fromBookAppointment: true,
                        step,
                        bookingPath: bookingPath ?? "primary",
                        selectedDept: resolvedDeptId,
                        selectedDoctor: doc.id,
                        isRequestMode: doc.availableOnline === false,
                        canBookSlot: doc.availableOnline !== false,
                      },
                    });
                  }}
                >
                  <div className="bg-white h-64 flex items-center justify-center relative overflow-hidden shrink-0 rounded-t-2xl">
                    {doc.image ? (
                      <img
                        src={doc.image}
                        alt={isAr ? doc.nameAr : doc.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-serif text-primary">{doc.initials}</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Stethoscope className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {selectedDoctor === doc.id && (
                      <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow bg-popover">
                    <p className="text-accent text-[10px] tracking-[0.15em] uppercase font-body mb-1">
                      {isAr ? doc.departmentAr || doc.specialtyAr : doc.department || doc.specialty}
                    </p>
                    <h4 className="font-serif text-sm text-foreground mb-0.5 leading-snug">
                      {isAr ? doc.nameAr : doc.name}
                    </h4>
                    <p className="text-muted-foreground font-body text-[11px] mb-2 line-clamp-1">
                      {isAr ? doc.specialtyAr : doc.specialty}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(isAr ? doc.languagesAr : doc.languages).map((l) => (
                        <span
                          key={l}
                          className="px-2 py-0.5 rounded-full bg-secondary/40 text-[10px] font-body text-foreground"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                    {doc.hideBooking !== true && (
                      <div
                        className={`flex items-center gap-1.5 mb-3 ${
                          doc.availableOnline !== false ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            doc.availableOnline !== false ? "bg-green-500" : "bg-muted-foreground"
                          }`}
                        />
                        <span className="font-body text-[10px]">
                          {doc.availableOnline !== false
                            ? isAr
                              ? "متاح للحجز"
                              : "Book Online"
                            : isAr
                              ? "غير متاح حالياً"
                              : "Request Appointment"}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const resolvedDeptId = selectedDept ?? resolveDeptIdForDoctor(doc);
                        navigate(`/doctors/${doc.id}`, {
                          state: {
                            fromBookAppointment: true,
                            step,
                            bookingPath: bookingPath ?? "primary",
                            selectedDept: resolvedDeptId,
                            selectedDoctor: doc.id,
                            isRequestMode: doc.availableOnline === false,
                            canBookSlot: doc.availableOnline !== false,
                          },
                        });
                      }}
                      className="mt-auto inline-flex items-center gap-1 text-primary font-body text-xs hover:text-accent transition-colors"
                    >
                      {isAr ? "عرض الملف الشخصي ←" : "View Profile →"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {!showAllDoctors && !doctorSearchTrimmed && docList.length > 6 && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setShowAllDoctors(true)}
                  className="px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase border border-border hover:border-accent/40 text-muted-foreground hover:text-foreground transition-all"
                >
                  {lang === "ar" ? "عرض جميع الأطباء" : `View All (${docList.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
export default DoctorSelection;
