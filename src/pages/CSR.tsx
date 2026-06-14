import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import LazyViewportVideo from "@/components/LazyViewportVideo";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { getAllCSR, type CSRItem } from "@/api/csr";

const CSR_CELEBRATING_LIFE_VIDEO_URL =
  "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a27add7dc7a58140d561ca5/1780985629227-Celebrating_Life(CSR).mp4";

type StaticInitiative = {
  titleKey: string;
  dateKey: string;
  p1Key: string;
  p2Key: string;
  image: string;
  alt: string;
};

type CSRInitiativeDisplay = {
  key: string;
  title: string;
  date: string;
  paragraphs: string[];
  image: string;
  alt: string;
};

const staticInitiatives: StaticInitiative[] = [
  {
    titleKey: "csrInit1Title",
    dateKey: "csrInit1Date",
    p1Key: "csrInit1P1",
    p2Key: "csrInit1P2",
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686016335-image4.png.png",
    alt: "Breast Cancer Awareness Hospital Session",
  },
  {
    titleKey: "csrInit2Title",
    dateKey: "csrInit2Date",
    p1Key: "csrInit2P1",
    p2Key: "csrInit2P2",
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686014084-image.png.png",
    alt: "Breast Cancer Awareness Session at Burgan Bank",
  },
  {
    titleKey: "csrInit3Title",
    dateKey: "csrInit3Date",
    p1Key: "csrInit3P1",
    p2Key: "csrInit3P2",
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686015581-image2.png.png",
    alt: "Special Olympics Health Screening",
  },
  {
    titleKey: "csrInit4Title",
    dateKey: "csrInit4Date",
    p1Key: "csrInit4P1",
    p2Key: "csrInit4P2",
    image:
      "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686015994-image3.png.png",
    alt: "Women's Health International Conference",
  },
];

const mapApiCSRToDisplay = (item: CSRItem, isAr: boolean): CSRInitiativeDisplay => ({
  key: item._id ?? item.heading,
  title: isAr ? item.headingArabic : item.heading,
  date: isAr ? item.subheadingArabic ?? item.subheading ?? "" : item.subheading ?? "",
  paragraphs: isAr ? item.descriptionArabic : item.description,
  image: item.images?.[0] ?? "",
  alt: isAr ? item.headingArabic : item.heading,
});

const mapStaticCSRToDisplay = (
  item: StaticInitiative,
  t: (key: string) => string,
): CSRInitiativeDisplay => ({
  key: item.titleKey,
  title: t(item.titleKey),
  date: t(item.dateKey),
  paragraphs: [t(item.p1Key), t(item.p2Key)],
  image: item.image,
  alt: item.alt,
});

const CSR = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [apiInitiatives, setApiInitiatives] = useState<CSRItem[] | null>(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAllCSR()
      .then((items) => {
        if (!cancelled) setApiInitiatives(items);
      })
      .catch((error) => {
        console.error("Failed to load CSR initiatives:", error);
        if (!cancelled) setApiInitiatives([]);
      })
      .finally(() => {
        if (!cancelled) setApiLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayInitiatives = useMemo(() => {
    if (apiLoaded && apiInitiatives && apiInitiatives.length > 0) {
      return apiInitiatives.map((item) => mapApiCSRToDisplay(item, isAr));
    }
    return staticInitiatives.map((item) => mapStaticCSRToDisplay(item, t));
  }, [apiLoaded, apiInitiatives, isAr, t]);

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("csrEyebrow")}</p>
            <h1 className={`text-4xl md:text-5xl font-serif text-foreground mb-4 text-center ${isAr ? "rtl-text-center" : ""}`}>
              {t("csrCelebratingLife")}
            </h1>
            <p className={`text-muted-foreground font-body text-sm max-w-xl mx-auto text-justify ${isAr ? "rtl-text" : ""}`}>
              {t("csrAboutP1")}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>
      <section className="pb-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black"
          >
            <LazyViewportVideo
              src={CSR_CELEBRATING_LIFE_VIDEO_URL}
              className="w-full h-full object-cover pointer-events-none"
              ariaLabel={isAr ? "فيديو الاحتفال بالحياة" : "Celebrating Life CSR video"}
              loadingLabel={isAr ? "جاري تحميل الفيديو…" : "Loading video…"}
            />
          </motion.div>
          <div className="max-w-3xl mx-auto mt-8 space-y-4">
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
              {t("csrAboutP2")}
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
              {t("csrAboutP3")}
            </p>
            <p className="font-serif text-xl text-primary text-center italic mt-6">
              {t("csrAboutTagline")}
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            {displayInitiatives.map((item) => (
              <ScrollAnimationWrapper key={item.key}>
                <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-border/40 bg-primary/5 px-6 py-10 md:px-8 space-y-6">
                  <div className="text-center max-w-4xl mx-auto">
                    <h3 className={`font-serif text-2xl font-bold text-foreground ${isAr ? "rtl-text-center" : ""}`}>
                      {item.title}
                    </h3>
                    {item.date ? (
                      <p className={`font-body text-sm font-bold text-muted-foreground mt-2 ${isAr ? "rtl-text-center" : ""}`}>
                        {item.date}
                      </p>
                    ) : null}
                  </div>
                  {item.image ? (
                    <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl aspect-video bg-muted">
                      <img src={item.image} alt={item.alt} className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                  <div className={`max-w-3xl mx-auto space-y-4 ${isAr ? "rtl-text" : ""}`}>
                    {item.paragraphs.map((paragraph, index) => (
                      <p
                        key={`${item.key}-p-${index}`}
                        className="font-body text-base text-muted-foreground leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        .rtl-text {
          direction: rtl;
          text-align: right;
        }
        .rtl-text-center {
          direction: rtl;
          text-align: center;
        }
      `}</style>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CSR;
