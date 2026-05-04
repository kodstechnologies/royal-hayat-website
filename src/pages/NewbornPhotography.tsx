import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ChatButton from "@/components/ChatButton";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Baby, Phone, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const babyImages = [
  "/images/baby/baby1.jpg",
  "/images/baby/baby2.jpg",
];

const NewbornPhotography = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [slide, setSlide] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (babyImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setSlide((prev) => (prev + 1) % babyImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />

      {/* Hero */}
      <section className="py-8 md:py-10 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {isAr ? "خدمات الضيافة" : "Hospitality Services"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-2">
              {isAr ? "خدمات تصوير المواليد" : "Newborn Photography Services"}
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              {isAr ? "التقط أثمن لحظات الحياة" : "Capture Life's Most Precious Moments"}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Main — image left, content right */}
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — carousel */}
            <div className="relative">
              <div className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`baby-${slide}`}
                    initial={{ x: 36 }}
                    animate={{ x: 0 }}
                    exit={{ x: -36 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={babyImages[slide]}
                      alt={isAr ? `تصوير المواليد ${slide + 1}` : `Newborn photography ${slide + 1}`}
                      className="w-full h-full object-cover cursor-zoom-in"
                      loading="lazy"
                      onClick={() => setLightbox(babyImages[slide])}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <button
                onClick={() => setSlide((prev) => (prev - 1 + babyImages.length) % babyImages.length)}
                aria-label={isAr ? "السابق" : "Previous"}
                disabled={babyImages.length <= 1}
                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => setSlide((prev) => (prev + 1) % babyImages.length)}
                aria-label={isAr ? "التالي" : "Next"}
                disabled={babyImages.length <= 1}
                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="flex items-center justify-center mt-5">
                <span className="font-body text-xs text-muted-foreground tracking-widest">
                  {String(slide + 1).padStart(2, "0")} / {String(babyImages.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* RIGHT — content */}
            <ScrollAnimationWrapper>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Baby className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                    {isAr ? "خدمات تصوير المواليد" : "Newborn Photography Services"}
                  </h2>
                </div>

                <h3 className="font-serif text-lg text-foreground mb-4">
                  {isAr ? "التقط أثمن لحظات الحياة" : "Capture Life's Most Precious Moments"}
                </h3>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {isAr
                    ? "استقبال مولودك الجديد هو من أغلى لحظات الحياة. في مستشفى رويال حياة، نقدم خدمات تصوير احترافية لتوثيق هذه اللحظات الخاصة خلال إقامتك."
                    : "Welcoming your newborn is one of life's most cherished milestones. At Royale Hayat Hospital, we offer professional photography services to beautifully capture these special moments during your stay."}
                </p>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  {isAr
                    ? "يضمن مصورونا المهرة، من أحد الاستوديوهات الرقمية الرائدة في الكويت، الحفاظ على كل ابتسامة ونظرة وذكرى سعيدة لك ولعائلتك لتخزّنوها لسنوات قادمة."
                    : "Our skilled photographers, from one of Kuwait's leading digital studios, ensure every smile, glance, and joyful memory is preserved for you and your family to treasure for years to come."}
                </p>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" />
                  <p className="font-body text-sm text-foreground">
                    {isAr ? "للاستفسارات والمواعيد، اتصل:" : "For inquiries and appointments, please contact:"}{" "}
                    <a href="tel:25360960" className="text-accent hover:underline font-semibold">2536 0960</a>
                  </p>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-background/20 text-white hover:bg-background/35 transition-colors flex items-center justify-center"
              aria-label={isAr ? "إغلاق" : "Close"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img
              src={lightbox}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default NewbornPhotography;
