import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { patientTestimonials } from "@/data/patientTestimonials";

const duplicated = [...patientTestimonials, ...patientTestimonials];

const VoicesFromOurPeople = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section className="py-20 bg-popover overflow-hidden">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4 !text-center">
              {isAr ? "كلمات من فريقنا" : "Testimonials"}
            </p>
            <h2 className={`text-3xl md:text-4xl font-serif text-foreground ${isAr ? "!font-bold" : "font-bold"}`}>
              {isAr ? "أصوات من فريقنا" : "Voices from Our People"}
            </h2>
          </div>
        </ScrollAnimationWrapper>
      </div>
      <div
        ref={containerRef}
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-6 w-max px-6"
          animate={{ x: isAr ? ["0%", "50%"] : ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 45, ease: "linear" } }}
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {duplicated.map((item, i) => (
            <motion.div
              key={`${item.name}-${item.text.slice(0, 24)}-${i}`}
              whileHover={{ y: -6 }}
              className="bg-background rounded-2xl p-6 md:p-8 border border-border/50 w-[300px] sm:w-[360px] flex-shrink-0"
            >
              <Quote className="w-6 h-6 text-accent mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p
                className="text-foreground font-body leading-relaxed mb-6 text-sm !text-left tracking-normal whitespace-normal break-words"
                style={{ wordSpacing: "normal", textAlign: "left" }}
              >
                "{isAr ? item.textAr : item.text}"
              </p>
              <p className="font-serif text-foreground text-sm">{isAr ? item.nameAr : item.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VoicesFromOurPeople;
