import { useEffect, useRef, useState } from "react";

type LazyViewportImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  rounded?: boolean;
};

const LazyViewportImage = ({
  src,
  alt,
  className = "w-full block",
  priority = false,
  rounded = false,
}: LazyViewportImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(priority);

  useEffect(() => {
    if (priority) {
      setInView(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority]);

  const placeholderClass = `w-full min-h-[32vh] bg-muted/20 ${rounded ? "rounded-2xl" : ""}`;

  return (
    <div ref={containerRef} className="w-full">
      {inView ? (
        <img
          src={src}
          alt={alt}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <div className={placeholderClass} aria-hidden />
      )}
    </div>
  );
};

export default LazyViewportImage;
