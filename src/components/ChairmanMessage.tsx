import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ChairmanMessage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { lang, t } = useLanguage();

  return (
    <section className="pb-0 pt-0 bg-secondary/10" ref={ref} id="chairman">

      {/* Full-width two-column layout — no card, no max-width */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        className={`flex flex-col md:flex-row w-full ${lang === "ar" ? "md:flex-row-reverse" : ""}`}
      >
        {/* LEFT — Photo placeholder */}
        <div className="md:w-[38%] lg:w-[35%] flex-shrink-0 bg-primary/10 min-h-[480px] md:min-h-[600px] flex items-end justify-center relative overflow-hidden">
          {/* Placeholder — swap src when ready */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="font-body text-xs tracking-widest uppercase">Photo Coming Soon</p>
          </div>

          {/* Name badge at bottom */}
          <div className="relative z-10 w-full bg-gradient-to-t from-primary/80 via-primary/40 to-transparent pt-20 pb-8 px-8">
            <p className="font-serif text-xl text-primary-foreground leading-tight">
              {t("chairmanName")}
            </p>
            <p className="font-body text-xs text-primary-foreground/80 mt-1 leading-snug">
              {t("chairmanTitle")}
            </p>
          </div>
        </div>

        {/* RIGHT — Message content, full height, no card bg */}
        <div className="flex-1 bg-secondary/20 px-10 md:px-14 lg:px-20 py-14 flex flex-col justify-center relative">
          {/* Decorative quote */}
          <Quote className="w-14 h-14 text-accent/10 absolute top-8 end-8" />

          {/* Greeting */}
          <p className="font-body text-sm font-semibold text-foreground mb-6 relative z-10">
            {lang === "ar" ? "عزيزي المريض / الزائر،" : "Dear Patient / Visitor,"}
          </p>

          {/* Opening quote */}
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 relative z-10 text-justify">
            {t("chairmanQuote")}
          </p>

          {/* Full message paragraphs */}
          <div className="space-y-4 mb-8 relative z-10">
            {t("chairmanFullMessage").split("\n\n").map((paragraph, i) => (
              <p key={i} className="font-body text-sm text-muted-foreground leading-relaxed text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Closing */}
          <div className="relative z-10 border-t border-border/40 pt-6">
            <p className="font-body text-sm text-muted-foreground mb-1">
              {lang === "ar" ? "مع أطيب التمنيات،" : "Kindest regards,"}
            </p>
            <p className="font-body text-xs text-accent mb-5">
              {lang === "ar"
                ? "مستشفى رويال حياة ...وجهتك لصحة أفضل والاحتفاء بالحياة!"
                : "Royale Hayat Hospital ...your destination for better health and to celebrate life!"}
            </p>
            <p className="font-body text-sm text-muted-foreground mb-0.5">
              {lang === "ar" ? "مع أطيب التمنيات،" : "With best wishes,"}
            </p>
            <p className="font-serif text-2xl text-foreground">{t("chairmanName")}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{t("chairmanTitle")}</p>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default ChairmanMessage;
