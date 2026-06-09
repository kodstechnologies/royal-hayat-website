import { useCallback } from "react";
import { preloadImageAsync } from "@/hooks/useCarouselPreload";

export function useSafeSlideChange(
  images: string[],
  slide: number,
  setSlide: (index: number) => void,
) {
  const goTo = useCallback(
    (nextIndex: number) => {
      if (images.length === 0) return;
      const normalized = ((nextIndex % images.length) + images.length) % images.length;
      setSlide(normalized);
      const url = images[normalized];
      if (url) void preloadImageAsync(url);
    },
    [images, setSlide],
  );

  const goNext = useCallback(() => {
    goTo(slide + 1);
  }, [goTo, slide]);

  const goPrev = useCallback(() => {
    goTo(slide - 1);
  }, [goTo, slide]);

  return { goTo, goNext, goPrev };
}
