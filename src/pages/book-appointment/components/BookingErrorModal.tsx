import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
type BookingErrorModalProps = {
  isAr: boolean;
  message: string;
  onDismiss: () => void;
  onConfirm: () => void;
};
const BookingErrorModal = ({ isAr, message, onDismiss, onConfirm }: BookingErrorModalProps) => (
  <div
    className="fixed inset-0 z-[75] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
    onClick={onDismiss}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md rounded-2xl border border-border/70 bg-popover shadow-2xl p-6 text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-destructive" />
        <p className="font-body text-sm text-foreground">{message}</p>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onConfirm}
          className="min-w-28 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
        >
          {isAr ? "موافق" : "OK"}
        </button>
      </div>
    </motion.div>
  </div>
);
export default BookingErrorModal;
