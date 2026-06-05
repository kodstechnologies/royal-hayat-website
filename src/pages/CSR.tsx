import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
const initiatives = [
  {
    titleKey: "csrInit1Title",
    dateKey: "csrInit1Date",
    p1Key: "csrInit1P1",
    p2Key: "csrInit1P2",
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686016335-image4.png.png",
    alt: "Breast Cancer Awareness Hospital Session",
  },
  {
    titleKey: "csrInit2Title",
    dateKey: "csrInit2Date",
    p1Key: "csrInit2P1",
    p2Key: "csrInit2P2",
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686014084-image.png.png",
    alt: "Breast Cancer Awareness Session at Burgan Bank",
  },
  {
    titleKey: "csrInit3Title",
    dateKey: "csrInit3Date",
    p1Key: "csrInit3P1",
    p2Key: "csrInit3P2",
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686015581-image2.png.png",
    alt: "Special Olympics Health Screening",
  },
  {
    titleKey: "csrInit4Title",
    dateKey: "csrInit4Date",
    p1Key: "csrInit4P1",
    p2Key: "csrInit4P2",
    image: "https://royal-hayat.s3.eu-central-1.amazonaws.com/file-manager/6a231c90f16f8c373c02c85e/1780686015994-image3.png.png",
    alt: "Women's Health International Conference",
  },
] as const;
const CSR = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      {}
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
      {}
      <section className="pb-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black"
          >
            <video
              src="https://res.cloudinary.com/dqznbmfja/video/upload/v1776248697/Land_Mark_Opening_Coverage_xrvvgf.mp4"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className="w-full h-full aspect-video object-cover pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <div className={`max-w-3xl mx-auto mt-8 space-y-4 ${isAr ? "rtl-text" : ""}`}>
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">{t("csrAboutP2")}</p>
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">{t("csrAboutP3")}</p>
            <p className={`font-serif text-xl text-primary text-center italic mt-6 ${isAr ? "rtl-text-center" : ""}`}>
              {t("csrAboutTagline")}
            </p>
          </div>
        </div>
      </section>
      {}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            {initiatives.map((item) => (
              <ScrollAnimationWrapper key={item.titleKey}>
                <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-border/40 bg-primary/5 px-6 py-10 md:px-8 space-y-6">
                  <div className="text-center max-w-4xl mx-auto">
                    <h3 className={`font-serif text-2xl font-bold text-foreground ${isAr ? "rtl-text-center" : ""}`}>
                      {t(item.titleKey)}
                    </h3>
                    <p className={`font-body text-sm font-bold text-muted-foreground mt-2 ${isAr ? "rtl-text-center" : ""}`}>
                      {t(item.dateKey)}
                    </p>
                  </div>
                  <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl aspect-video bg-muted">
                    <img src={item.image} alt={item.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className={`max-w-3xl mx-auto space-y-4 ${isAr ? "rtl-text" : ""}`}>
                    <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">{t(item.p1Key)}</p>
                    <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">{t(item.p2Key)}</p>
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
