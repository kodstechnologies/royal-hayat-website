import { motion } from "framer-motion";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

const StoryBlock = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section className="py-16 bg-background" id="about">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-0.5 bg-accent mx-auto mb-6" />
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("ourStory")}</p>
            <h2 className={`text-3xl md:text-4xl font-serif text-foreground mb-6 ${isAr ? "story-rtl-center" : ""}`}>
              {t("storyTitle")}
            </h2>
            <p
              className={`text-muted-foreground font-body text-sm md:text-base leading-relaxed mb-4 text-justify ${
                isAr ? "story-rtl" : ""
              }`}
            >
              {t("storyP1")}
            </p>
            <p
              className={`text-muted-foreground font-body text-sm md:text-base leading-relaxed text-justify ${
                isAr ? "story-rtl" : ""
              }`}
            >
              {t("storyP2")}
            </p>
          </div>
        </ScrollAnimationWrapper>
      </div>
      <style>{`
        .story-rtl {
          direction: rtl;
          text-align: right;
        }
        .story-rtl-center {
          direction: rtl;
          text-align: center;
        }
      `}</style>
    </section>
  );
};

export default StoryBlock;
