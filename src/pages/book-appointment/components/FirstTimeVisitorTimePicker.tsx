import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  FIRST_TIME_VISITOR_MINUTES,
  getFirstTimeVisitorHours,
  type AmPm,
} from "../firstTimeVisitorTimeSlots";

type FirstTimeVisitorTimePickerProps = {
  isAr: boolean;
  hour: string;
  minute: string;
  ampm: string;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
  onAmPmChange: (value: string) => void;
  canContinue: boolean;
  onContinue: () => void;
};

const selectClassName =
  "w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30";

const FirstTimeVisitorTimePicker = ({
  isAr,
  hour,
  minute,
  ampm,
  onHourChange,
  onMinuteChange,
  onAmPmChange,
  canContinue,
  onContinue,
}: FirstTimeVisitorTimePickerProps) => {
  const hourOptions = ampm === "AM" || ampm === "PM" ? getFirstTimeVisitorHours(ampm as AmPm) : [];

  return (
    <div className="space-y-4">
      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
        {isAr ? "اختر الوقت" : "Select a time"}
      </p>
      {!ampm && (
        <p className="font-body text-sm text-muted-foreground -mt-2">
          {isAr ? "اختر ص أو م أولاً." : "Select AM or PM first."}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {isAr ? "الساعة" : "Hour"}
          </label>
          <select
            value={hour}
            onChange={(e) => onHourChange(e.target.value)}
            disabled={!ampm}
            className={`${selectClassName} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="">{isAr ? "اختر الساعة" : "Select hour"}</option>
            {hourOptions.map((h) => (
              <option key={h} value={String(h)}>
                {h}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {isAr ? "الدقائق" : "Minutes"}
          </label>
          <select value={minute} onChange={(e) => onMinuteChange(e.target.value)} className={selectClassName}>
            <option value="">{isAr ? "اختر الدقائق" : "Select minutes"}</option>
            {FIRST_TIME_VISITOR_MINUTES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {isAr ? "ص / م" : "AM / PM"}
          </label>
          <select
            value={ampm}
            onChange={(e) => onAmPmChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">{isAr ? "اختر الفترة" : "Select period"}</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
      {canContinue && (
        <div className="flex justify-center pt-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-body text-xs tracking-widest uppercase hover:bg-primary/90 shadow-md transition-colors"
          >
            {isAr ? "متابعة" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default FirstTimeVisitorTimePicker;
