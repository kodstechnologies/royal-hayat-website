import { useLanguage } from "@/contexts/LanguageContext";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
const ChairmanMessage = () => {
  const { lang, t } = useLanguage();
  const rtl = lang === "ar" ? "rtl-text" : "";
  const bodyClass = `text-justify text-muted-foreground font-body text-sm md:text-base leading-relaxed ${rtl}`;
  const paragraphs = ["chairmanP1", "chairmanP2", "chairmanP3", "chairmanP4", "chairmanP5"] as const;
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl lg:max-w-7xl 2xl:max-w-[88rem] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12 items-center lg:items-start">
            <div className="w-full lg:w-[38%] xl:w-[36%] flex-shrink-0 flex justify-center lg:justify-start lg:mt-6 xl:mt-8">
              <div className="relative mx-auto w-full max-w-[320px] md:max-w-[420px] lg:max-w-none lg:w-full">
                <div className="relative w-full pt-[115%] md:pt-[118%] lg:pt-[128%] xl:pt-[124%] rounded-2xl overflow-hidden bg-primary/5 shadow-lg lg:shadow-xl">
                  <picture className="absolute inset-0 block size-full">
                    <source
                      media="(max-width: 767px)"
                      srcSet="https://royal-hayat.s3.eu-central-1.amazonaws.com/chairman/Chairman-mobile.jpeg"
                    />
                    <source
                      media="(min-width: 768px)"
                      srcSet="https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780685325295-chairman-web.png"
                    />
                    <img
                      src="https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a22fff4c88e2e7932620105/1780685325295-chairman-web.png"
                      alt={t("chairmanTitle")}
                      className="absolute inset-0 size-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full min-w-0 max-w-3xl space-y-4 md:space-y-5 lg:pt-1">
              <ScrollAnimationWrapper>
                <div className="space-y-4 lg:space-y-3.5 mt-4 md:mt-6 lg:pt-1">
                  <p lang={lang} className={bodyClass}>{t("chairmanGreeting")}</p>
                  {paragraphs.map((key) => (
                    <p key={key} lang={lang} className={bodyClass}>
                      {t(key)}
                    </p>
                  ))}
                  <div className="pt-4 space-y-3">
                    <p className={`text-muted-foreground font-body text-sm md:text-base leading-relaxed ${rtl}`}>
                      {t("chairmanRegards")}
                    </p>
                    <p className={`text-muted-foreground font-body text-sm md:text-base leading-relaxed ${rtl}`}>
                      {t("chairmanClosing")}
                    </p>
                    {lang === "en" && t("chairmanBestWishes") && (
                      <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                        {t("chairmanBestWishes")}
                      </p>
                    )}
                    <p className={`font-serif text-xl md:text-2xl font-bold text-foreground pt-1 ${rtl}`}>
                      {t("chairmanName")}
                    </p>
                    <p
                      className={`text-[#816107] font-body text-sm md:text-base leading-relaxed ${
                        lang === "ar" ? rtl : ""
                      }`}
                    >
                      {t("chairmanTitle")}
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ChairmanMessage;
