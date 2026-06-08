import { Star, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { patientTestimonials } from "@/data/patientTestimonials";
import AddFeedbackModal from "./AddFeedbackModal";

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { lang, t } = useLanguage();
  const [hospitalFeedbacks, setHospitalFeedbacks] = useState(patientTestimonials);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

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
        onSubmit={({ name, feedback, stars }) => {
          setHospitalFeedbacks((prev) => [
            {
              stars,
              text: feedback,
              textAr: feedback,
              name,
              nameAr: name,
            },
            ...prev,
          ]);
        }}
      />
    </section>
  );
};
export default TestimonialsSection;
