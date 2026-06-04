import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
const FifthFloorCafe = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [activeSlide, setActiveSlide] = useState(0);
  const menuItems = isAr
    ? ["قهوة مختصة طازجة", "تشكيلة من الساندويتشات", "سلطات طازجة", "حلويات شهية"]
    : ["Freshly brewed specialty coffee", "A selection of sandwiches", "Fresh salads", "Indulgent desserts"];
  const cafeCarouselImages = [
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/fifth-floor/WhatsApp+Image+2026-06-02+at+2.17.44+PM+(1).jpeg",
    "https://royal-hayat.s3.eu-central-1.amazonaws.com/fifth-floor/WhatsApp+Image+2026-06-02+at+2.17.44+PM.jpeg",
  ];
  useEffect(() => {
    if (cafeCarouselImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % cafeCarouselImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [cafeCarouselImages.length]);
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />
      {}
      <section className="py-8 md:py-10 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {isAr ? "خدمات الضيافة" : "Hospitality Services"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-2">
              {isAr ? "كافيه الطابق الخامس" : "The 5th Floor Café"}
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              {isAr ? "مساحة مريحة للقهوة والمرطبات" : "A cozy space for light bites and refreshments"}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="relative max-w-5xl mx-auto">
              <div className="relative aspect-[16/10] md:aspect-[16/8] rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-popover">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`fifth-floor-cafe-${activeSlide}`}
                    src={cafeCarouselImages[activeSlide]}
                    alt={isAr ? `كافيه الطابق الخامس ${activeSlide + 1}` : `The 5th Floor Cafe ${activeSlide + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.2 }}
                    transition={{ duration: 0.35 }}
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev - 1 + cafeCarouselImages.length) % cafeCarouselImages.length)}
                aria-label={isAr ? "الصورة السابقة" : "Previous image"}
                className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev + 1) % cafeCarouselImages.length)}
                aria-label={isAr ? "الصورة التالية" : "Next image"}
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center mt-4">
                <span className="font-body text-xs text-muted-foreground tracking-widest">
                  {String(activeSlide + 1).padStart(2, "0")} / {String(cafeCarouselImages.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="w-full">
            <ScrollAnimationWrapper>
              <div className="text-left">
                <p className="w-full font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  {isAr
                    ? "يقع كافيه الطابق الخامس في الطابق الخامس، ويوفر مساحة مريحة وترحيبية للضيوف للاسترخاء أثناء انتظار المواعيد أو زيارة أحبائهم. مصمم بعناية للعائلات التي تنتظر قدوم مولود جديد أو اكتمال إجراء طبي، يوفر بيئة هادئة ومطمئنة. يمكن للضيوف الاستمتاع بالقهوة المعدة طازجاً، وتشكيلة من الساندويتشات، والسلطات الطازجة، والحلويات الشهية — كل ذلك في أجواء مريحة تجمع بين الراحة والملاءمة."
                    : "The Fifth Café, located on the 5th floor, offers a welcoming and comfortable space for guests to relax while waiting for appointments or visiting loved ones. Thoughtfully designed for families awaiting the arrival of a newborn or the completion of a procedure, it provides a calm and reassuring environment. Guests can enjoy freshly brewed coffee, a selection of sandwiches, fresh salads, and indulgent desserts — all served in a cozy setting that blends comfort with convenience."}
                </p>
                <h3 className="font-serif text-base text-foreground mb-3 text-left">
                  {isAr ? "ما نقدمه:" : "What We Offer:"}
                </h3>
                <div className="space-y-2 mb-6 w-full text-left">
                  {menuItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="font-body text-sm text-muted-foreground">
                  {isAr ? "الطابق الخامس — مستشفى رويال حياة" : "5th Floor — Royale Hayat Hospital"}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default FifthFloorCafe;
