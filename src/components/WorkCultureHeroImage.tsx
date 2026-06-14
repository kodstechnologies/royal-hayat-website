import { useLanguage } from "@/contexts/LanguageContext";
const CULTURE_HERO_SRC_EN =
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/infant-secyrity/Life+at+Royale+hayat+Hospital.jpg.jpeg";
const CULTURE_HERO_SRC_AR =
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/Life+at+Royale+hayat+Hospital-flipped.jp.jpg.jpeg";
type WorkCultureHeroImageProps = {
  alt: string;
};
const HERO_IMG_CLASS =
  "work-culture-hero-img block h-auto w-full min-h-[1px] max-w-full object-contain object-left-top align-top";
const WorkCultureHeroImage = ({ alt }: WorkCultureHeroImageProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const sourceSrc = isAr ? CULTURE_HERO_SRC_AR : CULTURE_HERO_SRC_EN;
  const imgClassName = [HERO_IMG_CLASS, isAr ? "work-culture-hero-img--ar" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="relative w-full min-w-0 leading-[0] bg-background">
      <img
        key={sourceSrc}
        src={sourceSrc}
        alt={alt}
        loading="eager"
        decoding="async"
        className={imgClassName}
      />
    </div>
  );
};
export default WorkCultureHeroImage;
