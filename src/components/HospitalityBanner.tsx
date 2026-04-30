import { Crown, Sparkles, Bed, Coffee, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

const HospitalityBanner = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Crown, label: t("luxuryHalls") },
    { icon: Bed, label: t("vipSuites") },
    { icon: Sparkles, label: t("inRoomEvents") },
    { icon: Droplets, label: t("elementsSpa") },
    { icon: Coffee, label: t("alLiwanCafe") },
  ];

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <ScrollAnimationWrapper direction="left" className="lg:w-1/2">
            <div>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("premiumExperience")}</p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">{t("hospitalityServicesTitle")}</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">{t("hospitalityDesc")}</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((f, i) => (
                  <motion.div
                    key={f.label}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 bg-popover border border-border/50 rounded-xl px-4 py-3"
                  >
                    <f.icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">{f.label}</span>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/hospitality"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-sm tracking-wide hover:bg-primary/90 transition-colors"
              >
                {t("exploreHospitality")}
              </Link>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper direction="right" className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://res.cloudinary.com/dwhc8kzpv/image/upload/v1776940549/DSC08659_fyiftq.jpg"
                alt="VIP Hospital Suite"
                className="w-full h-auto"
                loading="lazy"
                width={1280}
                height={960}
              />
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  );
};

export default HospitalityBanner;
