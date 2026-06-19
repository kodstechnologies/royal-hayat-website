import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { Doctor } from "@/data/doctors";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
import { scrollDoctorCarousel, syncDoctorCarouselIndex } from "@/utils/doctorCarousel";
const DoctorCard = ({ doc }: { doc: Doctor }) => {
  const { lang } = useLanguage();
  const displayName = getDoctorDisplayName(doc, lang);
  return (
    <Link
      to={`/doctors/${doc.id}`}
      data-doctor-carousel-card
      className="relative z-0 block w-[280px] min-h-[430px] flex-shrink-0 snap-center hover:z-10 md:snap-start"
    >
      <motion.div
        dir={lang === "ar" ? "rtl" : "ltr"}
        whileHover={{ y: -6, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.12)" }}
        className="bg-popover rounded-2xl border border-border/50 group cursor-pointer w-full h-full flex flex-col transition-all duration-300 "
      >
        <div className="bg-white h-64 flex items-center justify-center relative overflow-hidden shrink-0 rounded-t-2xl">
          {doc.image ? (
            <img src={doc.image} alt={displayName} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30">
              <span className="text-2xl font-serif text-primary-foreground">{doc.initials}</span>
            </div>
          )}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center">
            <Stethoscope className="w-3.5 h-3.5 text-primary-foreground" />
          </div>  
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-accent text-[10px] tracking-[0.2em] uppercase font-body mb-1.5">
            {lang === "ar" ? doc.specialtyAr : doc.specialty}
          </p>
          <h3 className="text-[1.2rem] font-serif font-bold text-foreground mb-1">{displayName}</h3>
          <p className="text-muted-foreground font-body text-xs mb-3">{lang === "ar" ? doc.titleAr : doc.title}</p>
          {doc.hideBooking !== true && (
            <div className={`flex items-center gap-1.5 mb-2 ${doc.availableOnline !== false ? "text-green-600" : "text-destructive"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${doc.availableOnline !== false ? "bg-green-500" : "bg-destructive"}`} />
              <span className="font-body text-[10px]">
                {doc.availableOnline !== false
                  ? (lang === "ar" ? "متاح للحجز اونلاين" : "Book Online")
                  : (lang === "ar" ? "غير متاح للحجز اونلاين" : "Not Available")}
              </span>
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 text-primary font-body text-xs tracking-wide group-hover:text-accent transition-colors">
            {lang === "ar" ? "عرض الملف الشخصي ←" : "View Profile →"}
          </span>
        </div>
      </motion.div>
    </Link>
  );
};
const DoctorsSection = ({ featuredDoctors = [] }: { featuredDoctors?: Doctor[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { lang, t } = useLanguage();
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncDoctorCarouselIndex(el);
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
  }, []);
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", checkScroll);
      el?.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll, featuredDoctors]);
  const scroll = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollDoctorCarousel(scrollRef.current, dir);
    setTimeout(checkScroll, 400);
  }, [checkScroll]);
  const handleManualInteraction = (dir: "left" | "right") => {
    setIsPaused(true);
    scroll(dir);
  };
  useEffect(() => {
    if (isPaused || featuredDoctors.length <= 1) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      if (el.scrollLeft < maxScroll - 10) {
        scroll("right");
      } else {
        el.scrollTo({ left: 0, behavior: "smooth" });
        setTimeout(checkScroll, 400);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, scroll, checkScroll, featuredDoctors.length]);
  return (
    <section className="py-20 bg-background" id="our-doctors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <ScrollAnimationWrapper>
            <div>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">
                {lang === "ar" ? "فريقنا الطبي" : "Our Medical Team"}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
                {lang === "ar" ? "تعرف على أطبائنا" : "Meet Our Doctors"}
              </h2>
              <p className="text-muted-foreground font-body text-sm md:text-base max-w-xl">
                {lang === "ar"
                  ? "فريق من الأطباء المتخصصين يقدّم رعاية صحية على مستوى عالمي"
                  : "A team of specialized physicians delivering world-class healthcare"}
              </p>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper delay={0.1}>
            <Link to="/doctors" className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 rounded-full font-body text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-300">
              {t("viewAllDoctors")}
            </Link>
          </ScrollAnimationWrapper>
        </div>
        <div
          className="relative group"
          dir="ltr"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            type="button"
            onClick={() => handleManualInteraction("left")}
            disabled={!canScrollLeft}
            aria-label={lang === "ar" ? "السابق" : "Previous"}
            className={`absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-all shadow-md ltr-icon pointer-events-auto ${!canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary"}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleManualInteraction("right")}
            disabled={!canScrollRight}
            aria-label={lang === "ar" ? "التالي" : "Next"}
            className={`absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-all shadow-md ltr-icon pointer-events-auto ${!canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="max-w-[1192px] mx-auto overflow-hidden">
            <div
              ref={scrollRef}
              dir="ltr"
              onScroll={checkScroll}
              className="doctors-carousel-track flex items-stretch gap-4 overflow-x-auto pb-8 snap-x snap-mandatory max-md:scroll-px-[calc(50%-140px)] max-md:px-[calc(50%-140px)] md:gap-6 md:px-0 md:scroll-px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
            >
              {featuredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DoctorsSection;
