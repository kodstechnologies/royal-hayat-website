import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LifePhoto {
  src?: string;
  alt: string;
  caption?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  photos: LifePhoto[];
  /** auto-rotate interval in ms */
  interval?: number;
  /** background tint for the section */
  variant?: "default" | "muted";
}

/**
 * Auto-sliding single-image carousel.
 * - Shows ONE card at a time, full-width
 * - Side arrows to navigate
 * - Pause on hover
 * - Placeholder tiles when an image src is missing
 */
const LifePhotoCarousel = ({ title, subtitle, photos, interval = 4500, variant = "default" }: Props) => {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const total = photos.length;

  const next = useCallback(() => setIndex((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setIndex((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [isPaused, next, interval, total]);

  const current = photos[index];
  const isAr = lang === "ar";

  return (
    <section className={`py-16 ${variant === "muted" ? "bg-secondary/10" : "bg-background"}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
            {isAr ? "حياة في رويال حياة" : "Life at Royale Hayat"}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto mt-3">{subtitle}</p>
          )}
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ x: 36 }}
                animate={{ x: 0 }}
                exit={{ x: -36 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {current?.src ? (
                  <img
                    src={current.src}
                    alt={current.alt}
                    className="w-full h-full object-cover cursor-zoom-in"
                    loading="lazy"
                    onClick={() => setLightboxImage(current.src!)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-40" />
                    <p className="font-body text-xs tracking-widest uppercase">{current?.alt}</p>
                    <p className="font-body text-[10px] mt-1 opacity-70">
                      {isAr ? `الصورة ${index + 1} من ${total}` : `Photo ${index + 1} of ${total}`}
                    </p>
                  </div>
                )}
                {current?.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/80 to-transparent p-5">
                    <p className="font-body text-sm text-primary-foreground">{current.caption}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* counter */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="font-body text-xs text-muted-foreground tracking-widest">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-background/20 text-white hover:bg-background/35 transition-colors flex items-center justify-center"
              aria-label={isAr ? "إغلاق الصورة" : "Close image"}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt={isAr ? "صورة مكبرة" : "Enlarged image"}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LifePhotoCarousel;
