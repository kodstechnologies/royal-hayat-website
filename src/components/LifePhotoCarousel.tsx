import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CarouselImageFrame from "@/components/CarouselImageFrame";
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";
import { useSafeSlideChange } from "@/hooks/useSafeSlideChange";
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
  interval?: number;
  variant?: "default" | "muted";
}

const LifePhotoCarousel = ({
  title,
  subtitle,
  photos,
  interval = 4500,
  variant = "default",
}: Props) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const photosKey = useMemo(
    () => photos.map((photo) => photo.src ?? "").join("\0"),
    [photos],
  );
  const imageUrls = useMemo(
    () => photos.map((photo) => photo.src ?? "").filter(Boolean),
    [photosKey, photos],
  );
  const slideCount = imageUrls.length;

  useEffect(() => {
    setIndex((current) => (current >= slideCount ? 0 : current));
  }, [slideCount]);

  const current = photos[index] ?? photos[0];
  const { goNext, goPrev } = useSafeSlideChange(imageUrls, index, setIndex);
  const { setHovered } = useCarouselAutoplay({
    enabled: slideCount > 1,
    length: slideCount,
    onAdvance: goNext,
    intervalMs: interval,
    containerRef,
  });

  return (
    <section className={`py-16 ${variant === "muted" ? "bg-secondary/10" : "bg-background"}`}>
      <div className="container mx-auto px-6">
        <div className="mb-8 w-full flex flex-col items-center text-center">
          <p
            className="w-full text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 !text-center"
            style={{ textAlign: "center" }}
          >
            {isAr ? "حياة في رويال حياة" : "Life at Royale Hayat"}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground text-center">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto mt-3 text-center">
              {subtitle}
            </p>
          )}
        </div>
        <div
          ref={containerRef}
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-lg">
            {imageUrls.length > 0 ? (
              <CarouselImageFrame
                images={imageUrls}
                index={index}
                alt={current?.alt ?? title}
                className="h-full w-full object-cover cursor-zoom-in"
                onClick={() => {
                  const src = imageUrls[index];
                  if (src) setLightboxImage(src);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-3 opacity-40" />
                <p className="font-body text-xs tracking-widest uppercase">{current?.alt}</p>
                <p className="font-body text-[10px] mt-1 opacity-70">
                  {isAr ? `الصورة ${index + 1} من ${slideCount || photos.length}` : `Photo ${index + 1} of ${slideCount || photos.length}`}
                </p>
              </div>
            )}
            {current?.caption && (
              <div className="pointer-events-none absolute bottom-0 inset-x-0 z-[2] bg-gradient-to-t from-foreground/80 to-transparent p-5">
                <p className="font-body text-sm text-primary-foreground">{current.caption}</p>
              </div>
            )}
          </div>
          {slideCount > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label={isAr ? "السابق" : "Previous"}
                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 [webkit-tap-highlight-color:transparent]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={isAr ? "التالي" : "Next"}
                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 [webkit-tap-highlight-color:transparent]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="font-body text-xs text-muted-foreground tracking-widest">
              {String(index + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
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
