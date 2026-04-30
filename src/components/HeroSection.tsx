import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show text for 10 seconds on mount, then hide
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 10000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const handleMouseMove = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 2500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  return (
    <section
      className="relative h-[85vh] sm:h-[80vh] md:h-[90vh] min-h-[550px] md:min-h-[600px] overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video – minimal overlay so video is prominent */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/MT6T0YmWkfk?autoplay=1&mute=1&loop=1&playlist=MT6T0YmWkfk&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&playsinline=1&vq=hd1080"
          title="Hero Background"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            border: 'none',
            /* Always cover the container regardless of aspect ratio / screen size.
               16:9 video: to fill width → height = 56.25vw; to fill height → width = 177.78vh.
               We use whichever is larger so there are never black bars. */
            width: 'max(100%, 177.78vh)',
            height: 'max(100%, 56.25vw)',
          }}
        />
        {/* Light base gradient – always present but subtle */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

        {/* Heavier overlay fades in on hover to give text contrast */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Content – revealed on hover */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-6 py-12 h-full flex flex-col justify-center"
          >
            <div className="max-w-3xl">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 56 }}
                transition={{ duration: 0.6 }}
                className="h-0.5 bg-primary mb-8"
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif leading-[1.15] tracking-tight mb-4 md:mb-6"
              >
                <span className="text-foreground block">{t("exceptionalCare")}</span>
                <span className="text-primary italic block mt-2">{t("everyStage")}</span>
                <span className="text-foreground block mt-2">{t("everyAge")}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-[#A67C00] font-body text-sm md:text-base italic leading-relaxed mb-5 max-w-xl text-left"
              >
                {t("heroIntro")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-muted-foreground font-body text-sm md:text-base leading-relaxed mb-5 max-w-xl text-left"
              >
                {t("heroDesc")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.38 }}
                className="text-primary-foreground font-serif text-lg md:text-xl italic mb-8 max-w-xl"
              >
                {t("heroTagline")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#departments"
                  className="inline-flex items-center gap-3 border border-secondary text-foreground px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-secondary/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                >
                  {t("exploreServices")}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator – always visible */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => {
          const nextSection = document.getElementById('stats-row') || document.querySelector('section + *');
          if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-muted-foreground group cursor-pointer bg-transparent border-none outline-none"
        aria-label="Scroll to next section"
      >
        {/* <span className="text-xs tracking-[0.3em] uppercase font-body group-hover:text-accent transition-colors duration-300">
          {t("discover")}
        </span> */}
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
