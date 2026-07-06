import { Star, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { filterPatientTestimonialsForLang, type PatientTestimonial } from "@/data/patientTestimonials";
import AddFeedbackModal from "./AddFeedbackModal";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createHospitalFeedback,
  extractHospitalFeedbackRecord,
  getAllHospitalFeedbacks,
  mapHospitalFeedbackToTestimonial,
} from "@/api/feedback";

const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  const visibleCardCount = isMobile ? 1 : 3;
  const { lang, t } = useLanguage();
  const [hospitalFeedbacks, setHospitalFeedbacks] = useState<PatientTestimonial[]>([]);
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

        setHospitalFeedbacks(visible);
      })
      .catch((error) => {
        console.error("Failed to load hospital feedbacks:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayFeedbacks = useMemo(
    () => filterPatientTestimonialsForLang(hospitalFeedbacks, lang === "ar" ? "ar" : "en"),
    [hospitalFeedbacks, lang],
  );

  const shouldAnimateMarquee = displayFeedbacks.length > visibleCardCount;
  const feedbackMarqueeItems = useMemo(
    () =>
      shouldAnimateMarquee
        ? [...displayFeedbacks, ...displayFeedbacks]
        : displayFeedbacks,
    [displayFeedbacks, shouldAnimateMarquee],
  );

  return (
    <section id="testimonials" className="py-24 bg-popover overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("testimonials")}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">{t("patientFeedback")}</h2>
          </div>
        </ScrollAnimationWrapper>
      </div>
      <div className="container mx-auto px-6 mb-8 flex justify-end">
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
      <div className="container mx-auto px-6 overflow-hidden relative">
        {displayFeedbacks.length === 0 ? (
          <p className="text-center font-body text-sm text-muted-foreground">
            {lang === "ar"
              ? "لا توجد آراء للمرضى بعد. كن أول من يشارك تجربته."
              : "No patient feedback yet. Be the first to share your experience."}
          </p>
        ) : (
          <div
            className={`flex gap-6 ${
              shouldAnimateMarquee
                ? `w-max hover:[animation-play-state:paused] ${lang === "ar" ? "animate-[feedbackMarqueeRtl_30s_linear_infinite]" : "animate-[feedbackMarquee_30s_linear_infinite]"}`
                : "w-full justify-center"
            }`}
          >
            {feedbackMarqueeItems.map((item, i) => (
              <motion.div
                key={`${item.name}-${(lang === "ar" ? item.textAr : item.text).slice(0, 24)}-${i}`}
                whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(74,20,35,0.1)" }}
                className="bg-background rounded-2xl p-6 md:p-8 border border-border/50 w-[360px] flex-shrink-0"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground font-body leading-relaxed mb-6 text-sm">
                  "{lang === "ar" ? item.textAr : item.text}"
                </p>
                <p className="font-serif text-foreground text-sm">
                  {lang === "ar" ? item.nameAr || item.name : item.name || item.nameAr}
                </p>
              </motion.div>
            ))}
          </div>
        )}
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
