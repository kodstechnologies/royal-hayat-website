import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselImageFrame from "@/components/CarouselImageFrame";
import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";
import { useSafeSlideChange } from "@/hooks/useSafeSlideChange";

type ImageCarouselProps = {
  images: string[];
  slide: number;
  setSlide: (index: number) => void;
  altForIndex: (index: number) => string;
  autoPlay?: boolean;
  aspectClass?: string;
  frameClass?: string;
  imageClass?: string;
  onImageClick?: (src: string) => void;
  isAr?: boolean;
};

const ImageCarousel = ({
  images,
  slide,
  setSlide,
  altForIndex,
  autoPlay = false,
  aspectClass = "aspect-[5/4]",
  frameClass = "relative overflow-hidden bg-popover border border-border/50 shadow-lg rounded-2xl",
  imageClass = "h-full w-full cursor-zoom-in object-cover",
  onImageClick,
  isAr = false,
}: ImageCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { goNext, goPrev } = useSafeSlideChange(images, slide, setSlide);
  const { setHovered } = useCarouselAutoplay({
    enabled: autoPlay,
    length: images.length,
    onAdvance: goNext,
    containerRef,
  });

  const disabled = images.length <= 1;

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`${frameClass} ${aspectClass}`}>
        <CarouselImageFrame
          images={images}
          index={slide}
          alt={altForIndex(slide)}
          className={imageClass}
          onClick={onImageClick ? () => onImageClick(images[slide]) : undefined}
        />
      </div>
      <button
        type="button"
        onClick={goPrev}
        aria-label={isAr ? "السابق" : "Previous"}
        disabled={disabled}
        className="absolute -left-4 md:-left-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background/95 disabled:hover:text-foreground"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label={isAr ? "التالي" : "Next"}
        disabled={disabled}
        className="absolute -right-4 md:-right-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background/95 disabled:hover:text-foreground"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="mt-5 flex items-center justify-center gap-3">
        <span className="font-body text-xs tracking-widest text-muted-foreground">
          {String(slide + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default ImageCarousel;
