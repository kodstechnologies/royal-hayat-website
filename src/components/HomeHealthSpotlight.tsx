import { Home, Heart, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
const HomeHealthSpotlight = () => {
  const { t } = useLanguage();
  const features = [
    { icon: Home, label: t("homeNursing") },
    { icon: Heart, label: t("postOpCare") },
    { icon: Clock, label: t("available247homeHealth") },
    { icon: Shield, label: t("certifiedTeam") },
  ];
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="bg-accent/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("careAtHome")}</p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">{t("royaleHomeHealth")}</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">{t("homeHealthFullDesc")}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2 bg-popover rounded-full px-4 py-2 border border-border/50">
                    <f.icon className="w-4 h-4 text-accent" />
                    <span className="font-body text-xs text-foreground">{f.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/home-health" className="inline-flex bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-sm tracking-wide hover:bg-primary/90 transition-colors">
                {t("learnMore")}
              </Link>
            </div>
            <div className="md:w-1/3">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <Home className="w-16 h-16 text-accent" />
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};
export default HomeHealthSpotlight;
