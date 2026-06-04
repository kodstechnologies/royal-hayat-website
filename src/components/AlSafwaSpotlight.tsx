import { Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
const AlSafwaSpotlight = () => {
  const { t } = useLanguage();
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <Link to="/al-safwa" className="block">
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(127,35,70,0.12)" }}
              className="max-w-3xl mx-auto bg-popover border border-border/50 rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5">
                <Crown className="w-8 h-8 text-accent" />
              </div>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-2">
                {t("eliteHealthcare")}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                {t("alSafwaProgram")}
              </h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xl mx-auto mb-6">
                {t("alSafwaSpotlightDesc")}
              </p>
              <span className="inline-flex items-center gap-2 text-accent font-body text-sm font-medium">
                {t("learnMore")} <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          </Link>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};
export default AlSafwaSpotlight;
