import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Calendar, Clock } from "lucide-react";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Slot } from "@/api/royalhayat";
import type { DoctorWithClinicCode as Doctor } from "@/types/doctor";
import { pageVariants, type BookingDeptRow } from "../types";
type TimeSlotStepProps = {
  isAr: boolean;
  lang: string;
  specialityCode: string | null;
  providerCode: string | null;
  selectedDeptObj?: BookingDeptRow;
  selectedDoctorObj?: Doctor;
  selectedCalendarDate: Date | undefined;
  handleAppointmentDateSelect: (date: Date | undefined) => void;
  isAppointmentDateDisabled: (date: Date) => boolean;
  selectedDate: string;
  showSlotSelection: boolean;
  setShowSlotSelection: (value: boolean) => void;
  isLoadingSlots: boolean;
  fetchedSlots: Slot[];
  slotsByPeriod: {
    morning: Slot[];
    afternoon: Slot[];
    evening: Slot[];
  };
  selectedSlot: string | null;
  setSelectedSlot: (value: string) => void;
  setSelectedSlotId: (value: string | null) => void;
  setStep: (step: number) => void;
  formatSlotRange: (slot: Slot) => string;
};
const TimeSlotStep = ({
  isAr,
  lang,
  specialityCode,
  providerCode,
  selectedDeptObj,
  selectedDoctorObj,
  selectedCalendarDate,
  handleAppointmentDateSelect,
  isAppointmentDateDisabled,
  selectedDate,
  showSlotSelection,
  setShowSlotSelection,
  isLoadingSlots,
  fetchedSlots,
  slotsByPeriod,
  selectedSlot,
  setSelectedSlot,
  setSelectedSlotId,
  setStep,
  formatSlotRange,
}: TimeSlotStepProps) => (
  <motion.div
    key="s3"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.35 }}
  >
    <div className="max-w-3xl mx-auto">
      <div className="bg-popover rounded-2xl p-6 md:p-8 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-foreground">
              {isAr ? "اختيار التاريخ والوقت" : "Select Date & Time"}
            </h2>
            <p className="text-muted-foreground font-body text-xs">
              {isAr ? "يرجى اختيار التاريخ والوقت المناسبين للموعد." : "Pick a date and available time slot"}
            </p>
          </div>
        </div>
        {specialityCode && providerCode && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 font-body text-xs uppercase tracking-wider">
            <div className="flex gap-2 items-center">
              <span className="text-muted-foreground">{isAr ? "القسم:" : "Speciality:"}</span>
              <span className="font-semibold text-foreground">
                {isAr ? selectedDeptObj?.nameAr : selectedDeptObj?.name}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-muted-foreground">{isAr ? "الطبيب:" : "Doctor:"}</span>
              <span className="font-semibold text-foreground">
                {isAr ? selectedDoctorObj?.nameAr : selectedDoctorObj?.name}
              </span>
            </div>
          </div>
        )}
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">
          {isAr ? "اختر تاريخاً" : "Select a date"}
        </p>
        <div className="flex justify-center mb-4">
          <DatePickerCalendar
            mode="single"
            selected={selectedCalendarDate}
            onSelect={handleAppointmentDateSelect}
            disabled={isAppointmentDateDisabled}
            className={cn("rounded-xl border border-border bg-background p-3 pointer-events-auto")}
          />
        </div>
        {selectedDate && (
          <p className="font-body text-sm text-center text-foreground mb-4">
            {isAr ? "التاريخ المحدد:" : "Selected date:"}{" "}
            <span className="font-medium text-primary">
              {selectedCalendarDate?.toLocaleDateString(lang === "ar" ? "ar-KW" : "en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
        )}
        {selectedDate && !showSlotSelection && (
          <div className="flex justify-center mb-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSlotSelection(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-primary/90 shadow-md transition-colors"
            >
              {isAr ? "اختر موعداً" : "Select a slot"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
        {showSlotSelection && selectedDate && isLoadingSlots && (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent mb-4"
            />
            <p className="font-body text-sm text-muted-foreground">
              {isAr ? "جارِ جلب المواعيد المتاحة..." : "Fetching available time slots..."}
            </p>
          </div>
        )}
        {showSlotSelection && selectedDate && !isLoadingSlots && fetchedSlots.length > 0 && (
          <div className="space-y-6">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
              {isAr ? "الفترة المتاحة" : "Available times"}
            </p>
            {Object.entries(slotsByPeriod).map(
              ([period, slots]) =>
                slots.length > 0 && (
                  <div key={period}>
                    <h3 className="font-body text-sm font-medium text-foreground mb-3 capitalize">
                      {isAr
                        ? period === "morning"
                          ? "صباحًا"
                          : period === "afternoon"
                            ? "مساءً"
                            : period
                        : period}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.slot_booking_id || slot.slot_from_time}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot.slot_from_time);
                            setSelectedSlotId(slot.slot_booking_id);
                            setStep(4);
                          }}
                          className={`p-3 sm:p-4 rounded-xl border text-xs sm:text-sm font-body transition-all text-center whitespace-nowrap ${
                            selectedSlot === slot.slot_from_time
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-background border-border hover:border-accent/40 hover:bg-accent/5 text-foreground"
                          }`}
                        >
                          {formatSlotRange(slot)}
                        </button>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}
        {showSlotSelection && selectedDate && !isLoadingSlots && fetchedSlots.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-body text-sm bg-muted/20 rounded-2xl border border-dashed border-border">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
            {isAr ? "لا توجد مواعيد متاحة لهذا اليوم" : "No available appointments for this date"}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);
export default TimeSlotStep;
