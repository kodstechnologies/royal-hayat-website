import { motion } from "framer-motion";
import { Building2, CheckCircle2, ClipboardList, Clock, FileText, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import type { DoctorWithClinicCode as Doctor } from "@/types/doctor";
import type { BookingDeptRow } from "../types";
type BookingSuccessProps = {
  isAr: boolean;
  isRequestMode: boolean;
  t: (key: string) => string;
  selectedDoctorObj?: Doctor;
  selectedDeptObj?: BookingDeptRow;
  patientName: string;
  selectedDate: string;
  selectedSlot: string | null;
  formattedSelectedDate: string;
  formatTimeString: (time: string | null) => string;
  onBackToHome: () => void;
};
const BookingSuccess = ({
  isAr,
  isRequestMode,
  t,
  selectedDoctorObj,
  selectedDeptObj,
  patientName,
  selectedDate,
  selectedSlot,
  formattedSelectedDate,
  formatTimeString,
  onBackToHome,
}: BookingSuccessProps) => (
  <div className="min-h-screen bg-background pt-[var(--header-height,56px)] overflow-x-hidden">
    <Header />
    <div className="pt-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-primary py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-serif text-primary-foreground mb-3">
          {isRequestMode ? t("requestSubmitted") : t("appointmentConfirmed")}
        </h1>
        <p className="text-primary-foreground/70 font-body text-sm max-w-md mx-auto">
          {isRequestMode ? t("requestConfirmMsg") : t("bookingConfirmMsg")}
        </p>
      </motion.div>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-popover rounded-2xl border border-border p-8 mb-6 shadow-sm -mt-8"
        >
          <h3 className="font-serif text-lg text-foreground mb-5">{t("appointmentDetails")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-body text-sm">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("doctor")}</p>
                <p className="text-foreground font-medium">{selectedDoctorObj?.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("department")}</p>
                <p className="text-foreground font-medium">
                  {selectedDeptObj?.name || selectedDoctorObj?.specialty}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">{t("patient")}</p>
                <p className="text-foreground font-medium">{patientName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  {isAr ? "الوقت" : "Time Slot"}
                </p>
                <p className="text-foreground font-medium">
                  {selectedDate && selectedSlot
                    ? `${formattedSelectedDate} • ${formatTimeString(selectedSlot)}`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-popover rounded-2xl border border-border p-8 mb-6"
        >
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            {t("nextSteps")}
          </h3>
          <ul className="space-y-3 font-body text-sm text-muted-foreground">
            {[t("step1"), t("step2"), t("step3"), t("step4")].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="bg-primary text-primary-foreground px-10 py-3.5 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            {t("backToHome")}
          </button>
        </div>
      </div>
    </div>
    <Footer />
    <ScrollToTop />
  </div>
);
export default BookingSuccess;
