import { useEffect, useRef, useState } from "react";
import {
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
  const [shownIndex, setShownIndex] = useState(index);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const incomingRef = useRef<HTMLImageElement>(null);
  const pendingIndexRef = useRef(index);

  useEffect(() => {
    setShownIndex(index);
    setLoadingIndex(null);
    pendingIndexRef.current = index;
    preloadCarouselImages(images, index);
  }, [images]);

  useEffect(() => {
    pendingIndexRef.current = index;
    preloadCarouselImages(images, index);

    if (index === shownIndex) {
      setLoadingIndex(null);
      return;
    }

    const targetSrc = images[index];
    if (!targetSrc) return;

    setLoadingIndex(index);
    void preloadImageAsync(targetSrc);
  }, [images, index, shownIndex]);

  const promoteIncoming = (loadedIndex: number) => {
    if (pendingIndexRef.current !== loadedIndex) return;
    markCarouselImageCached(images[loadedIndex] ?? "");
    setShownIndex(loadedIndex);
    setLoadingIndex(null);
  };

  useEffect(() => {
    const img = incomingRef.current;
    if (loadingIndex === null || !img) return;
    if (img.complete && img.naturalWidth > 0) {
      promoteIncoming(loadingIndex);
    }
  }, [loadingIndex, images]);

  const shownSrc = images[shownIndex] ?? "";
  const loadingSrc = loadingIndex !== null ? (images[loadingIndex] ?? "") : "";

  return (
    <div className="relative h-full w-full bg-muted">
      {shownSrc && (
        <img
          src={shownSrc}
          alt={loadingIndex === null ? alt : ""}
          aria-hidden={loadingIndex !== null}
          className={`${className} absolute inset-0`}
          decoding="async"
          onClick={loadingIndex === null ? onClick : undefined}
        />
      )}
      {loadingSrc && loadingIndex !== null && (
        <img
          ref={incomingRef}
          key={loadingSrc}
          src={loadingSrc}
          alt={alt}
          className={`${className} absolute inset-0 z-[1]`}
          decoding="async"
          onLoad={() => promoteIncoming(loadingIndex)}
          onError={() => promoteIncoming(loadingIndex)}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default CarouselImageFrame;
