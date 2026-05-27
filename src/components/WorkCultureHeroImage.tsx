import { useEffect, useState } from "react";

const CULTURE_HERO_SRC =
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/infant-secyrity/Life+at+Royale+hayat+Hospital.jpg.jpeg";

type WorkCultureHeroImageProps = {
  alt: string;
  className?: string;
};

/** iPad Pro, Nest Hub, Zenbook Fold — only band where WebKit mirrors the hero */
export const isTabletHeroViewport = () => {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  return w >= 1024 && w <= 1535;
};

const WorkCultureHeroImage = ({ alt, className = "" }: WorkCultureHeroImageProps) => {
  const [displaySrc, setDisplaySrc] = useState(CULTURE_HERO_SRC);
  const [tabletMode, setTabletMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setTabletMode(isTabletHeroViewport());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    setLoaded(false);
  }, [displaySrc]);

  useEffect(() => {
    let cancelled = false;

    const bakeToCanvas = (source: CanvasImageSource, width: number, height: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      ctx.drawImage(source, 0, 0, width, height);
      if (!cancelled) {
        setDisplaySrc(canvas.toDataURL("image/jpeg", 0.92));
      }
      return true;
    };

    const fallbackViaImg = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled) return;
        try {
          if (!bakeToCanvas(img, img.naturalWidth, img.naturalHeight)) {
            setDisplaySrc(CULTURE_HERO_SRC);
          }
        } catch {
          setDisplaySrc(CULTURE_HERO_SRC);
        }
      };
      img.onerror = () => {
        if (!cancelled) setDisplaySrc(CULTURE_HERO_SRC);
      };
      img.src = CULTURE_HERO_SRC;
    };

    const normalize = async () => {
      if (typeof createImageBitmap !== "function") {
        fallbackViaImg();
        return;
      }
      try {
        const res = await fetch(CULTURE_HERO_SRC, { mode: "cors" });
        if (!res.ok) throw new Error("fetch failed");
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
        if (cancelled) {
          bitmap.close();
          return;
        }
        if (!bakeToCanvas(bitmap, bitmap.width, bitmap.height)) {
          setDisplaySrc(CULTURE_HERO_SRC);
        }
        bitmap.close();
      } catch {
        fallbackViaImg();
      }
    };

    normalize();
    return () => {
      cancelled = true;
    };
  }, []);

  const imgClassName = tabletMode
    ? "work-culture-hero-img work-culture-hero-img--tablet absolute inset-0 h-full w-full object-cover object-left"
    : className;

  return (
    <div className="relative w-full h-full min-h-[inherit]">
      <img
        src={displaySrc}
        alt={alt}
        loading="eager"
        decoding="sync"
        onLoad={() => setLoaded(true)}
        className={`${imgClassName} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

export default WorkCultureHeroImage;
