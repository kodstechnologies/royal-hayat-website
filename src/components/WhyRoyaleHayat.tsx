import luxuryRoom from "@/assets/luxury-room.jpg";
import { Shield, Star, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyRoyaleHayat = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, titleKey: "internationallyAccredited", descKey: "internationallyAccreditedDesc" },
    { icon: Star, titleKey: "vipExperience", descKey: "vipExperienceDesc" },
    { icon: Award, titleKey: "awardWinningCare", descKey: "awardWinningCareDesc" },
    { icon: Heart, titleKey: "compassionateApproach", descKey: "compassionateApproachDesc" },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <ScrollAnimationWrapper direction="left" className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img src="https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776942143/DSC08672_ubs2ca.jpg" alt="Luxury hospital suite at Royale Hayat" className="w-full h-auto" loading="lazy" width={1280} height={960} />
              {/* <img src="https://res.cloudinary.com/dwhc8kzpv/image/upload/v1777546445/DSC08672_zc7pu9.jpg" alt="Luxury hospital suite at Royale Hayat" className="w-full h-auto" loading="lazy" width={1280} height={960} /> */}

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary rounded-xl px-6 py-4 sm:px-8 sm:py-5 text-center shadow-2xl">
                <p className="text-2xl sm:text-3xl font-serif text-primary-foreground">86%</p>
                <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-body text-primary-foreground/80">{t("patientSatisfaction")}</p>
              </motion.div>
            </div>
          </ScrollAnimationWrapper>

          <div className="lg:w-1/2 w-full">
            <ScrollAnimationWrapper direction="right">
              <div className="w-12 h-0.5 bg-accent mb-4 sm:mb-6" />
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 sm:mb-4">{t("whyRoyaleHayat")}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-2 leading-tight">
                {t("whereLuxuryMeets")} <span className="text-accent italic">{t("worldClass")}</span>
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-4 sm:mb-6 leading-tight">{t("medicine")}</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8 sm:mb-10">{t("whyDesc")}</p>
            </ScrollAnimationWrapper>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((f, i) => (
                <ScrollAnimationWrapper key={f.titleKey} delay={i * 0.1} direction="right">
                  <motion.div whileHover={{ y: -4 }} className="flex gap-4 p-4 rounded-xl bg-popover border border-border/30 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm text-foreground mb-1">{t(f.titleKey)}</h4>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
                    </div>
                  </motion.div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyRoyaleHayat;