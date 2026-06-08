import { useEffect, useState } from "react";
import {
  isCarouselImageCached,
  markCarouselImageCached,
  preloadCarouselImages,
  preloadImageAsync,
} from "@/hooks/useCarouselPreload";

type CarouselImageFrameProps = {
  images: string[];
  index: number;
  alt: string;
  className?: string;
  onClick?: () => void;
};

const CarouselImageFrame = ({
  images,
  index,
  alt,
  className = "h-full w-full object-cover",
  onClick,
}: CarouselImageFrameProps) => {
  const targetSrc = images[index] ?? "";
  const [displayIndex, setDisplayIndex] = useState(index);
  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    preloadCarouselImages(images, index);

    if (!targetSrc) return;

    if (isCarouselImageCached(targetSrc)) {
      setDisplayIndex(index);
      setLoadingNext(false);
      return;
    }

    let cancelled = false;
    setLoadingNext(true);

    void preloadImageAsync(targetSrc).then(() => {
      if (cancelled) return;
      markCarouselImageCached(targetSrc);
      setDisplayIndex(index);
      setLoadingNext(false);
    });

    return () => {
      cancelled = true;
    };
  }, [images, index, targetSrc]);

  const displaySrc = images[displayIndex] ?? targetSrc;

  return (
    <div className="relative h-full w-full">
      {loadingNext && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/15" aria-hidden>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      )}
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        loading="eager"
        decoding="async"
        onLoad={() => {
          markCarouselImageCached(displaySrc);
          if (displayIndex !== index && isCarouselImageCached(targetSrc)) {
            setDisplayIndex(index);
            setLoadingNext(false);
          }
        }}
        onClick={onClick}
      />
    </div>
  );
};

export default CarouselImageFrame;
