import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Loader2 } from "lucide-react";
import { pageVariants } from "../types";

type ReviewRow = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type BookingConfirmationProps = {
  isAr: boolean;
  isRequestMode: boolean;
  t: (key: string) => string;
  reviewRows: ReviewRow[];
  bookingError: string | null;
  isSubmitting: boolean;
  onConfirm: () => void;
};

const BookingConfirmation = ({
  isAr,
  isRequestMode,
  t,
  reviewRows,
  bookingError,
  isSubmitting,
  onConfirm,
}: BookingConfirmationProps) => (
  <motion.div
    key="s4"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.35 }}
  >
    <div className="max-w-3xl mx-auto">
      <div className="bg-popover rounded-2xl p-8 md:p-10 border border-border shadow-sm">
        <h2 className="font-serif text-xl text-foreground mb-2">
          {isRequestMode ? t("reviewSubmit") : t("reviewConfirm")}
        </h2>
        <div className="space-y-5">
          {reviewRows.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-4 py-3 border-b border-border last:border-0"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <row.icon className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </p>
                <p className="font-body text-sm text-foreground font-medium">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
        {bookingError && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="font-body text-sm text-destructive">{bookingError}</p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-4">
          <motion.button
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isAr ? "جارِ الإرسال..." : "Submitting..."}
              </>
            ) : (
              <>{isAr ? "تأكيد الحجز" : "Confirm Booking"}</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default BookingConfirmation;
