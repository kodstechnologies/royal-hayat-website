import { useEffect, useRef, useState, type RefObject } from "react";

type UseCarouselAutoplayOptions = {
  enabled: boolean;
  length: number;
  onAdvance: () => void;
  intervalMs?: number;
  containerRef: RefObject<HTMLElement | null>;
};

export function useCarouselAutoplay({
  enabled,
  length,
  onAdvance,
  intervalMs = 5000,
  containerRef,
}: UseCarouselAutoplayOptions) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const onAdvanceRef = useRef(onAdvance);

  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!enabled || !inView || hovered || length <= 1) return;

    const timer = window.setInterval(() => {
      onAdvanceRef.current();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [enabled, inView, hovered, length, intervalMs]);

  return { hovered, setHovered, inView };
}
