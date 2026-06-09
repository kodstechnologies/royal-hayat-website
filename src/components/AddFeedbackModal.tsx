import { useEffect, useState } from "react";
import { Star, X, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export type FeedbackFormData = {
  name: string;
  feedback: string;
  stars: number;
};

type AddFeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => void | Promise<void>;
  subtitleEn?: string;
  subtitleAr?: string;
  feedbackPlaceholderEn?: string;
  feedbackPlaceholderAr?: string;
};

const AddFeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  subtitleEn = "Share your experience with the hospital",
  subtitleAr = "شارك تجربتك مع المستشفى",
  feedbackPlaceholderEn = "Write your experience with the hospital",
  feedbackPlaceholderAr = "اكتب تجربتك مع المستشفى",
}: AddFeedbackModalProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [showThankYou, setShowThankYou] = useState(false);
  const [form, setForm] = useState<FeedbackFormData>({
    name: "",
    feedback: "",
    stars: 0,
  });

  useEffect(() => {
    if (!isOpen) return;
    setShowThankYou(false);
    setForm({ name: "", feedback: "", stars: 0 });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.feedback.trim()) return;
    try {
      await onSubmit(form);
      setForm({ name: "", feedback: "", stars: 5 });
      setShowThankYou(true);
      window.setTimeout(() => {
        setShowThankYou(false);
        onClose();
      }, 2000);
    } catch {
      // Parent handles error feedback (e.g. toast).
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="
            relative
            w-full
            max-w-md
            max-h-[min(90vh,calc(100dvh-2rem))]
            overflow-y-auto
            overscroll-y-contain
            rounded-3xl
            border
            border-border/50
            bg-background/95
            p-5
            shadow-[0_25px_80px_rgba(0,0,0,0.25)]
            backdrop-blur-xl
            sm:p-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/15 shadow-sm">
              <MessageCircleHeart className="h-8 w-8 text-primary drop-shadow-sm" />
            </div>
            <h2 className="mb-1 font-serif text-2xl text-foreground sm:text-3xl">
              {isAr ? "إضافة تقييم" : "Add Feedback"}
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              {isAr ? subtitleAr : subtitleEn}
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              {isAr ? "الاسم" : "Your Name"}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={isAr ? "أدخل اسمك" : "Enter your name"}
              className="
                w-full
                rounded-2xl
                border
                border-border/60
                bg-secondary/20
                px-5
                py-4
                outline-none
                transition-all
                duration-300
                focus:border-primary
                focus:ring-4
                focus:ring-primary/10
              "
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              {isAr ? "التقييم" : "Feedback"}
            </label>
            <textarea
              rows={3}
              value={form.feedback}
              onChange={(e) => setForm((prev) => ({ ...prev, feedback: e.target.value }))}
              placeholder={isAr ? feedbackPlaceholderAr : feedbackPlaceholderEn}
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-border/60
                bg-secondary/20
                px-5
                py-4
                outline-none
                transition-all
                duration-300
                focus:border-primary
                focus:ring-4
                focus:ring-primary/10
              "
            />
          </div>

          <div className="mb-8">
            <label className="mb-3 block text-center text-sm font-medium">
              {isAr ? "التقييم بالنجوم" : "Star Rating"}
            </label>
            <div className="flex items-center justify-center gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, stars: index + 1 }))}
                >
                  <Star
                    className={`h-8 w-8 transition-all duration-300 ${
                      index < form.stars
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                        : "text-border"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleSubmit}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-primary
              py-4
              text-sm
              font-semibold
              tracking-wide
              text-primary-foreground
              shadow-lg
              transition-all
              duration-300
              hover:bg-primary/90
              hover:shadow-xl
            "
          >
            <Star className="h-4 w-4 fill-current" />
            {isAr ? "إرسال التقييم" : "Submit Feedback"}
          </motion.button>

          {showThankYou && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 180,
              }}
              className="
                absolute
                inset-0
                z-50
                flex
                items-center
                justify-center
                rounded-3xl
                bg-background/90
                px-6
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-primary/20
                  bg-primary/10
                  px-6
                  py-5
                  shadow-2xl
                "
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.15,
                    type: "spring",
                    stiffness: 260,
                  }}
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-primary/20
                    bg-primary/15
                  "
                >
                  <MessageCircleHeart className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-base font-semibold text-primary"
                  >
                    {isAr ? "شكراً لك على ملاحظاتك" : "Thank you for your feedback"}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {isAr ? "نحن نقدر وقتك ومشاركتك" : "We truly appreciate your response"}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AddFeedbackModal;
