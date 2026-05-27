import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const CULTURE_HERO_SRC_EN =
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/infant-secyrity/Life+at+Royale+hayat+Hospital.jpg.jpeg";
const CULTURE_HERO_SRC_AR =
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Life+at+Royale+hayat+Hospital-flipped.jp.jpg.jpeg";

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
  const { lang } = useLanguage();
  const sourceSrc = lang === "ar" ? CULTURE_HERO_SRC_AR : CULTURE_HERO_SRC_EN;
  const [tabletMode, setTabletMode] = useState(false);

  useEffect(() => {
    const sync = () => setTabletMode(isTabletHeroViewport());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const imgClassName = tabletMode
    ? "work-culture-hero-img work-culture-hero-img--tablet absolute inset-0 h-full w-full object-cover object-left"
    : className;

  return (
    <div className="relative w-full h-full min-h-[inherit]">
      <img
        key={sourceSrc}
        src={sourceSrc}
        alt={alt}
        loading="eager"
        decoding="sync"
        className={imgClassName}
      />
    </div>
  );
};

export default WorkCultureHeroImage;
