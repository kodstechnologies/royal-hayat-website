import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const HeroSection = () => {
  const { t, lang, dir } = useLanguage();
  const isAr = lang === "ar";
  const heroAlignClass = isAr
    ? dir === "rtl"
      ? "items-start"
      : "items-end"
    : "items-start";
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 10000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => { });
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => { });
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  const handleMouseMove = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 2500);
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  const renderHeroDesc = () => {
    const description = t("heroDesc");
    const hospitalName = isAr ? "مستشفى رويال حياة" : "Royale Hayat Hospital";

    if (!description.includes(hospitalName)) {
      return description;
    }

    const [before, after] = description.split(hospitalName);
    return (
      <>
        {before}
        <strong className="font-semibold">{hospitalName}</strong>
        {after}
      </>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[85vh] sm:h-[80vh] md:h-[90vh] min-h-[520px] max-lg:min-h-[calc(100dvh-var(--header-height,7.5rem)-2rem)] md:min-h-[600px] overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="https://royal-hayat.s3.eu-central-1.amazonaws.com/static/RHH+SH+16+Website+(1).mp4"
          autoPlay
          loop
          muted
          playsInline
          onClick={handleVideoClick}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />
        {}
        {}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
        {}
        <motion.div
          className={`absolute inset-0 pointer-events-none ${
            isAr
              ? "bg-gradient-to-l from-background/80 via-background/40 to-transparent"
              : "bg-gradient-to-r from-background/80 via-background/40 to-transparent"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>
      {}
      {
}
      {}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-start pt-4 pb-20 max-lg:pt-2 lg:justify-center lg:py-12 pointer-events-none ${heroAlignClass}`}
          >
            <div
              className="max-w-3xl w-full flex flex-col"
              dir={isAr ? "rtl" : "ltr"}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 56 }}
                transition={{ duration: 0.6 }}
                className={`h-0.5 bg-primary mb-4 max-lg:mb-5 md:mb-8 ${isAr ? "self-start" : ""}`}
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`font-serif leading-[1.2] tracking-tight mb-3 max-lg:mb-4 md:mb-6 ${
                  isAr
                    ? "text-start text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                    : "text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
                }`}
              >
                <span className="text-foreground block">{t("exceptionalCare")}</span>
                <span className="text-primary block mt-1 max-lg:mt-1.5 md:mt-2">
                  {t("everyStage")}{" "}
                  <span className="max-lg:block md:inline">{t("everyAge")}</span>
                </span>
              </motion.h1>
              {t("heroIntro") ? (
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className={`font-body leading-relaxed mb-3 max-lg:mb-4 md:mb-5 max-w-xl ${
                    isAr
                      ? "text-start text-sm sm:text-base md:text-lg text-[#6B5200]"
                      : "text-left text-sm md:text-base text-[#A67C00]"
                  }`}
                >
                  {t("heroIntro")}
                </motion.p>
              ) : null}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className={`font-body leading-relaxed mb-3 max-lg:mb-4 md:mb-5 max-w-xl whitespace-pre-line ${
                  isAr
                    ? "text-start text-sm sm:text-base md:text-lg text-muted-foreground"
                    : "text-left text-sm md:text-base text-muted-foreground"
                }`}
              >
                {renderHeroDesc()}
              </motion.p>
              {t("heroTagline") ? (
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.38 }}
                  className={`font-serif mb-5 max-lg:mb-6 md:mb-8 max-w-xl text-burgundy ${
                    isAr
                      ? "text-start text-base md:text-lg lg:text-xl"
                      : "text-base md:text-xl"
                  }`}
                >
                  {t("heroTagline")}
                </motion.p>
              ) : null}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className={`flex flex-wrap gap-4 pointer-events-auto ${isAr ? "justify-start" : ""}`}
              >
                <a
                  href="/medical-services"
                  className="inline-flex items-center gap-3 border border-secondary text-foreground px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-secondary/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                >
                  {t("exploreServices")}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => {
          const nextSection = document.getElementById('stats-row') || document.querySelector('section + *');
          if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-muted-foreground group cursor-pointer bg-transparent border-none outline-none"
        aria-label="Scroll to next section"
      >
        <div className="relative w-10 h-10 flex items-center justify-center">
          <motion.div className="absolute inset-0 rounded-full border border-accent/30" animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute inset-0 rounded-full border border-accent/20" animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
          <motion.div className="w-10 h-10 rounded-full border border-secondary/40 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <svg className="w-4 h-4 group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.button>
    </section>
  );
};
export default HeroSection;
