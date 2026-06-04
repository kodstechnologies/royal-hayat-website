import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

export type LazyWhenInViewProps = {
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
  /** Intersection root margin passed to useInView */
  margin?: string;
};

/**
 * Renders children only when the wrapper enters (or nears) the viewport.
 * Use to defer image downloads and heavy child mounts until scroll.
 */
const LazyWhenInView = ({
  children,
  placeholder = null,
  className,
  dir,
  margin = "200px 0px",
}: LazyWhenInViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin });

  return (
    <div ref={ref} dir={dir} className={className}>
      {inView ? children : placeholder}
    </div>
  );
};

export const sectionPlaceholder = (className = "min-h-[240px] bg-background") => (
  <div className={`${className} animate-pulse`} aria-hidden />
);

export const lifeCarouselPlaceholder = (variant: "default" | "muted" = "default") => (
  <section
    className={`py-16 ${variant === "muted" ? "bg-secondary/10" : "bg-background"}`}
    aria-hidden
  >
    <div className="container mx-auto px-6 max-w-4xl animate-pulse">
      <div className="h-8 w-64 bg-muted rounded mx-auto mb-8" />
      <div className="aspect-[16/10] md:aspect-[16/9] w-full bg-muted rounded-2xl" />
    </div>
  </section>
);

export default LazyWhenInView;
