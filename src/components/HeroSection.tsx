import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);   // start muted so browser allows autoplay
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Show text for 10 seconds on mount, then hide
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 10000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  // Play/pause based on visibility in viewport
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
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

  // Sync muted state to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Click on video → toggle play/pause (no visible button)
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
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

  return (
    <section
      ref={sectionRef}
      className="relative h-[85vh] sm:h-[80vh] md:h-[90vh] min-h-[550px] md:min-h-[600px] overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video — full bleed, click to pause/play */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="https://royal-hayat.s3.eu-central-1.amazonaws.com/static/RHH+VIDEO+(1).mp4"
          autoPlay
          loop
          muted          /* must start muted for autoplay to work in all browsers */
          playsInline
          onClick={handleVideoClick}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />

        {/* Paused overlay removed — no visible button when paused */}

        {/* Light base gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

        {/* Heavier overlay fades in on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Mute / Unmute button — top right, icon only in gold color */}
      <button
        onClick={() => setIsMuted((m) => !m)}
        className="absolute top-4 right-4 z-20 flex items-center justify-center transition-opacity hover:opacity-70"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        style={{ color: '#9B804E' }}
      >
        {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
      </button>

      {/* Content — revealed on hover */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-6 py-12 h-full flex flex-col justify-center pointer-events-none"
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
                <span className="text-primary block mt-2">{t("everyStage")} {t("everyAge")}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-[#A67C00] font-body text-sm md:text-base leading-relaxed mb-5 max-w-xl text-left"
              >
                {t("heroIntro")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-muted-foreground font-body text-sm md:text-base leading-relaxed mb-5 max-w-xl text-left whitespace-pre-line"
              >
                {t("heroDesc")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.38 }}
                className="text-gray-400 font-serif text-lg md:text-xl mb-8 max-w-xl"
              >
                {t("heroTagline")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="flex flex-wrap gap-4 pointer-events-auto"
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

      {/* Scroll indicator */}
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
