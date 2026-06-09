import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type LazyViewportVideoProps = {
  src: string;
  className?: string;
  aspectClass?: string;
  priority?: boolean;
  ariaLabel?: string;
  loadingLabel?: string;
};

const LazyViewportVideo = ({
  src,
  className = "w-full h-full object-cover",
  aspectClass = "aspect-video",
  priority = false,
  ariaLabel,
  loadingLabel = "Loading video…",
}: LazyViewportVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    const video = videoRef.current;
    const node = containerRef.current;
    if (!video || !node || !inView) return;

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    playObserver.observe(node);
    return () => playObserver.disconnect();
  }, [inView]);

  const isLoading = inView && !loaded;

  return (
    <div ref={containerRef} className={`relative w-full ${aspectClass}`}>
      {!inView && (
        <div className="absolute inset-0 bg-muted/20" aria-hidden />
      )}
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/30 backdrop-blur-[1px]"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
          <span className="font-body text-xs text-muted-foreground">{loadingLabel}</span>
        </div>
      )}
      {inView && (
        <video
          ref={videoRef}
          src={src}
          playsInline
          autoPlay
          muted
          loop
          preload="metadata"
          disablePictureInPicture
          aria-label={ariaLabel}
          onCanPlay={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`${className}${isLoading ? " opacity-0" : ""}`}
        />
      )}
    </div>
  );
};

export default LazyViewportVideo;
