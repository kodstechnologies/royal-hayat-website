import { Star, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { patientTestimonials, type PatientTestimonial } from "@/data/patientTestimonials";
import AddFeedbackModal from "./AddFeedbackModal";
import {
  createHospitalFeedback,
  extractHospitalFeedbackRecord,
  getAllHospitalFeedbacks,
  type HospitalFeedbackRecord,
} from "@/api/feedback";

const mapHospitalFeedbackToTestimonial = (
  record: HospitalFeedbackRecord,
): PatientTestimonial => ({
  name: record.userName || record.arabicUserName || "",
  nameAr: record.arabicUserName || record.userName || "",
  text: record.feedback || record.arabicFeedback || "",
  textAr: record.arabicFeedback || record.feedback || "",
  stars: record.stars,
});

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { lang, t } = useLanguage();
  const [hospitalFeedbacks, setHospitalFeedbacks] = useState(patientTestimonials);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAllHospitalFeedbacks()
      .then((feedbacks) => {
        if (cancelled) return;

        const visible = feedbacks
          .filter((fb) => fb.shownOnWebsite !== false)
          .map(mapHospitalFeedbackToTestimonial)
          .filter((item) => item.text || item.textAr);

        if (visible.length > 0) {
          setHospitalFeedbacks(visible);
        }
      })
      .catch((error) => {
        console.error("Failed to load hospital feedbacks:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-24 bg-popover overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("testimonials")}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">{t("patientFeedback")}</h2>
          </div>
        </ScrollAnimationWrapper>
      </div>
      <div className="flex justify-end mb-8 px-6">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsFeedbackOpen(true)}
          className="
      bg-primary
      text-primary-foreground
      px-6
      py-3.5
      rounded-2xl
      text-sm
      font-medium
      tracking-wide
      shadow-lg
      hover:shadow-xl
      hover:bg-primary/90
      transition-all
      duration-300
      flex
      items-center
      gap-2
    "
        >
          <MessageCircleHeart className="w-5 h-5 text-white drop-shadow-sm" />
          {lang === "ar" ? "إضافة تقييم" : "Add Feedback"}
        </motion.button>
      </div>
      <div ref={containerRef} className="relative w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <motion.div className="flex gap-6 w-max px-6"
          animate={{ x: lang === "ar" ? ["0%", "50%"] : ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" } }}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}>
          {[...hospitalFeedbacks, ...hospitalFeedbacks].map((item, i) => (
            <motion.div key={`${item.name}-${item.text.slice(0, 24)}-${i}`} whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(74,20,35,0.1)" }}
              className="bg-background rounded-2xl p-6 md:p-8 border border-border/50 w-[300px] sm:w-[360px] flex-shrink-0">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground font-body leading-relaxed mb-6 text-sm">"{lang === "ar" ? item.textAr : item.text}"</p>
              <p className="font-serif text-foreground text-sm">{lang === "ar" ? item.nameAr : item.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <AddFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={async ({ name, feedback, stars }) => {
          try {
            const response = await createHospitalFeedback(
              {
                userName: name,
                arabicUserName: name,
                feedback,
                arabicFeedback: feedback,
                stars,
              },
              { addedBy: "patient" },
            );

            const record = extractHospitalFeedbackRecord(response);
            if (record && record.shownOnWebsite !== false) {
              setHospitalFeedbacks((prev) => [
                mapHospitalFeedbackToTestimonial(record),
                ...prev,
              ]);
            }
          } catch (error) {
            const backendMessage =
              axios.isAxiosError(error)
                ? error.response?.data?.message ||
                  error.response?.data?.error ||
                  error.message
                : null;
            toast.error(
              backendMessage ||
                (lang === "ar"
                  ? "تعذر إرسال التقييم. يرجى المحاولة مرة أخرى."
                  : "Failed to submit feedback. Please try again."),
            );
            throw error;
          }
        }}
      />
    </section>
  );
};
export default TestimonialsSection;
