import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ChairmanMessage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { lang, t } = useLanguage();

  return (
    <section className="pb-16 pt-4 bg-secondary/10" ref={ref} id="chairman">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("aMessageFrom")}</p>
            <h2 className="text-2xl md:text-3xl font-body text-foreground mb-2">{t("theChairman")}</h2>
            <p className="font-body text-sm text-muted-foreground mb-8">{lang === "ar" ? "مرحباً بكم في مستشفى رويال حياة" : "Welcome To Royale Hayat Hospital"}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-popover rounded-2xl p-8 md:p-10 border border-border/50 relative text-start">
            <Quote className="w-8 h-8 text-accent/20 absolute top-6 start-6" />
            <p className="font-body text-sm md:text-sm text-foreground leading-relaxed mb-6 relative z-10 text-justify">{lang === "ar" ? "عزيزي المريض / الزائر،" : "Dear Patient / Visitor,"}</p>
            <p className="font-body text-sm md:text-sm text-foreground leading-relaxed mb-6 relative z-10 text-justify">
              {t("chairmanQuote")}
            </p>
            <div className="space-y-4 mb-6">
              {t("chairmanFullMessage").split("\n\n").map((paragraph, i) => (
                <p key={i} className="font-body text-sm text-muted-foreground leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2 text-justify">
              {lang === "ar" ? "مع أطيب التمنيات،" : "Kindest regards,"}
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 text-justify">
              {lang === "ar" ? "مستشفى رويال حياة ...وجهتك لصحة أفضل والاحتفاء بالحياة!" : "Royale Hayat Hospital ...your destination for better health and to celebrate life!"}
            </p>
            <div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-1 text-justify">
                {lang === "ar" ? "مع أطيب التمنيات،" : "With best wishes,"}
              </p>
              <p className="font-body text-xl md:text-2xl text-muted-foreground leading-relaxed">{t("chairmanName")}</p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{t("chairmanTitle")}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanMessage;
