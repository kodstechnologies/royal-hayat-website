import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import EventBookingModal from "@/components/EventBookingModal";
import { Sparkles, Phone, CheckCircle2, Gift, UtensilsCrossed, UserCheck, ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
type InRoomEventsProps = {
  topCarouselImages: string[];
  galleryImages: string[];
};
const InRoomEvents = ({ topCarouselImages, galleryImages }: InRoomEventsProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const ltrPhoneClass = "inline-block [direction:ltr] [unicode-bidi:isolate]";
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [eventBookingOpen, setEventBookingOpen] = useState(false);
  useEffect(() => {
    if (!lightboxImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxImage]);
  useEffect(() => {
    if (topCarouselImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % topCarouselImages.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [topCarouselImages.length]);
  useEffect(() => {
    setActiveSlide(0);
  }, [topCarouselImages]);
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      {}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {isAr ? "خدمات الضيافة" : "Hospitality Services"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {isAr ? "تجارب الاحتفال داخل الأجنحة" : "In-Suite Celebration Experiences"}
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-3xl mx-auto leading-relaxed text-justify">
              {isAr
                ? "اصنعوا لحظات لا تُنسى واحتفلوا بمناسباتكم الخاصة بكل خصوصية وراحة داخل أجنحتكم الفاخرة، حيث تلتقي الأجواء الدافئة بالضيافة الراقية لتمنحكم تجربة استثنائية مليئة بالذكريات الجميلة."
                : "Create meaningful celebrations in the comfort and privacy of your own suite."}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-popover border border-border/50 shadow-lg">
                <AnimatePresence initial={false} mode="wait">
                  {topCarouselImages.length > 0 ? (
                    <motion.img
                      key={`in-room-events-${activeSlide}`}
                      src={topCarouselImages[activeSlide]}
                      alt={isAr ? `صورة فعالية ${activeSlide + 1}` : `In-room event image ${activeSlide + 1}`}
                      initial={{ x: 36 }}
                      animate={{ x: 0 }}
                      exit={{ x: -36 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                      loading="lazy"
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxImage(topCarouselImages[activeSlide])}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setLightboxImage(topCarouselImages[activeSlide]);
                        }
                      }}
                    />
                  ) : (
                    <motion.div
                      key="in-room-events-empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted/30"
                    >
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="font-serif text-lg text-foreground mb-1">
                          {isAr ? "معرض الفعاليات" : "In-Room Events Gallery"}
                        </p>
                        <p className="font-body text-sm text-muted-foreground">
                          {isAr ? "سيتم إضافة الصور قريباً" : "Photos coming soon"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {topCarouselImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveSlide((prev) => (prev - 1 + topCarouselImages.length) % topCarouselImages.length)
                    }
                    aria-label={isAr ? "السابق" : "Previous"}
                    className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev + 1) % topCarouselImages.length)}
                    aria-label={isAr ? "التالي" : "Next"}
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {topCarouselImages.length > 1 && (
                <div className="flex items-center justify-center gap-3 mt-5">
                  <span className="font-body text-xs text-muted-foreground tracking-widest">
                    {String(activeSlide + 1).padStart(2, "0")} / {String(topCarouselImages.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="py-12 md:py-16 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-3 text-center">
                {isAr ? "خدماتنا" : "Our Services"}
              </h2>
              <p className="font-body text-sm text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed text-justify">
                {isAr
                  ? "نقدم مجموعة متكاملة من الخدمات المصممة بعناية لتحويل مناسبتكم إلى تجربة استثنائية لا تُنسى."
                  : "We offer a comprehensive range of services to make your occasion truly unforgettable"}
              </p>
            </ScrollAnimationWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Gift,
                  title: isAr ? "تصميم وديكور مخصص" : "Custom Design & Décor",
                  desc: isAr
                    ? "نقوم بتنسيق وتجهيز الجناح بما يتناسب مع طابع مناسبتكم الخاصة وأسلوبكم الفريد. من تنسيقات الورود والبالونات إلى الإضاءة والأقمشة الفاخرة، حيث يتم تصميم كل تفصيل بعناية ليعكس رؤيتكم ويمنحكم أجواءً مميزة."
                    : "We will transform your suite to reflect the unique theme and style of your occasion. From balloons and flowers to lighting and fabrics, every detail is custom-designed to match your vision.",
                },
                {
                  icon: UtensilsCrossed,
                  title: isAr ? "ضيافة ومأكولات فاخرة" : "Gourmet Catering",
                  desc: isAr
                    ? "استمتعوا بتجربة طعام راقية تضم تشكيلة مختارة من الأطباق المُعدة بعناية من مطابخنا المتخصصة.\n\nمن المقبلات الفاخرة إلى الحلويات الراقية، نحرص على تقديم تجربة ضيافة استثنائية ترضي جميع الأذواق."
                    : "Enjoy a selection of specially crafted dishes from our top-tier kitchen. From exquisite appetizers to delectable desserts, we deliver an exceptional dining experience.",
                },
                {
                  icon: UserCheck,
                  title: isAr ? "خدمة كبير الخدم" : "Butler Service",
                  desc: isAr
                    ? "يتواجد فريقنا المتخصص لخدمتكم والاهتمام بجميع التفاصيل طوال المناسبة، من استقبال الضيوف وحتى ترتيب وتنظيم الأجواء، نضمن لكم تجربة سلسة ومريحة بكل احترافية وخصوصية."
                    : "Our professional butlers will be on hand to assist with every need. From reception to cleanup, we ensure a seamless and comfortable experience.",
                },
              ].map((item, i) => (
                <ScrollAnimationWrapper key={i}>
                  <div className="bg-popover border border-border/50 rounded-2xl p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{item.desc}</p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto w-full">
            <ScrollAnimationWrapper>
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
                    {isAr ? "المناسبات التي نقوم بتنسيقها" : "Occasions We Serve:"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {(isAr
                      ? [
                          "احتفالات استقبال المواليد",
                          "أعياد الميلاد والذكرى السنوية",
                          "حفلات الاستقبال والتجمعات العائلية",
                          "المفاجآت الخاصة للمرضى والضيوف",
                          "جميع المناسبات المميزة التي تستحق الاحتفال",
                        ]
                      : [
                          "Newborn celebrations",
                          "Birthdays and anniversaries",
                          "Reception parties and family gatherings",
                          "Personalized surprises for patients and guests",
                          "Any special occasion worth celebrating",
                        ]
                    ).map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-popover border border-border/50 rounded-xl px-5 py-4 h-full min-w-0 w-full">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground flex-1 min-w-0">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
      {}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-8 text-center">
                {isAr ? "معرض الصور" : "Photo Gallery"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((src, i) => (
                  <div key={src} className="aspect-[4/3] rounded-xl border border-border overflow-hidden bg-muted/20">
                    <img
                      src={src}
                      alt={isAr ? `صورة فعالية ${i + 1}` : `Event photo ${i + 1}`}
                      className="w-full h-full object-cover cursor-zoom-in"
                      loading="lazy"
                      onClick={() => setLightboxImage(src)}
                    />
                  </div>
                ))}
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
      {}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {isAr ? "احجز مناسبتك اليوم" : "Book Your Event Today"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed text-justify">
              {isAr
                ? "فريقنا المتخصص على أتم الاستعداد لمساعدتكم في تنظيم مناسبة استثنائية تبقى في الذاكرة"
                : "Our dedicated team is ready to help you plan an unforgettable occasion."}
            </p>
            <div className="flex flex-col items-center gap-4">
              <a
                href="tel:+96525360573"
                dir="ltr"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors [direction:ltr] [unicode-bidi:isolate]"
              >
                <Phone className="w-4 h-4" />
                <span className={ltrPhoneClass}>+965 2536 0573</span>
              </a>
              <button
                type="button"
                onClick={() => setEventBookingOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
              >
                {isAr ? "احجز مناسبتك اليوم" : "Book your Event Online"}
              </button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      <EventBookingModal isOpen={eventBookingOpen} isAr={isAr} onClose={() => setEventBookingOpen(false)} />
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-background/20 text-white hover:bg-background/35 transition-colors flex items-center justify-center"
              aria-label={isAr ? "إغلاق الصورة" : "Close image"}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt={isAr ? "صورة مكبرة" : "Enlarged image"}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default InRoomEvents;
