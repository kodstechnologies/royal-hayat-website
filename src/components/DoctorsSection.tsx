import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { Doctor } from "@/data/doctors";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCatagoriesWithDepartmentsAndDoctors } from "@/api/catagory";
import {
  mapCategoriesToGroupedMedicalDepartments,
  collectFeaturedDoctorsFromGrouped,
} from "@/utils/mapMedicalCatalogFromApi";

const DoctorCard = ({ doc }: { doc: Doctor }) => {
  const { lang } = useLanguage();
  return (
    <Link to={`/doctors/${doc.id}`} className="block w-[280px] min-h-[430px] flex-shrink-0 relative z-0 hover:z-10 snap-center md:snap-start">
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.12)" }}
        className="bg-popover rounded-2xl border border-border/50 group cursor-pointer w-full h-full flex flex-col transition-all duration-300 "
      >
        <div className="bg-white h-64 flex items-center justify-center relative overflow-hidden shrink-0 rounded-t-2xl">
          {doc.image ? (
            <img src={doc.image} alt={lang === "ar" ? doc.nameAr : doc.name} className="w-full h-full object-cover object-top" />
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
          <h3 className="text-base font-serif text-foreground mb-1">{lang === "ar" ? doc.nameAr : doc.name}</h3>
          <p className="text-muted-foreground font-body text-xs mb-3">{lang === "ar" ? doc.titleAr : doc.title}</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(lang === "ar" ? doc.languagesAr : doc.languages).map((l) => (
              <span key={l} className="px-2.5 py-0.5 rounded-full bg-secondary/40 text-[10px] font-body text-foreground">{l}</span>
            ))}
          </div>  
          {doc.hideBooking !== true && (
            <div className={`flex items-center gap-1.5 mb-2 ${doc.availableOnline !== false ? "text-green-600" : "text-destructive"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${doc.availableOnline !== false ? "bg-green-500" : "bg-destructive"}`} />
              <span className="font-body text-[10px]">
                {doc.availableOnline !== false
                  ? (lang === "ar" ? "متاح للحجز الإلكتروني" : "Book Online")
                  : (lang === "ar" ? "غير متاح للحجز الإلكتروني" : "Not Available")}
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

const DoctorsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const { lang, t } = useLanguage();
  const isMobile = useIsMobile();

  const hasDoctors = useMemo(() => featuredDoctors.length > 0, [featuredDoctors]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const categories = await getCatagoriesWithDepartmentsAndDoctors();
        const grouped = mapCategoriesToGroupedMedicalDepartments(categories);
        const doctorsFromApi = collectFeaturedDoctorsFromGrouped(grouped, 12);
        if (!cancelled) setFeaturedDoctors(doctorsFromApi);
      } catch {
        if (!cancelled) {
          setLoadError(true);
          setFeaturedDoctors([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Allow slight margin for rounding errors
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(Math.ceil(scrollLeft) + clientWidth < scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, featuredDoctors]);

  const scroll = useCallback((dir: "left" | "right") => {
    if (scrollRef.current) {
      // On mobile, scroll by card width (280) + large gap (80)
      // On desktop, scroll card width (280) + gap (24)
      const amount = isMobile ? (280 + 80) : (280 + 24) * 2;
      let newLeft = scrollRef.current.scrollLeft + (dir === "left" ? -amount : amount);
      scrollRef.current.scrollTo({ left: newLeft, behavior: "smooth" });
      setTimeout(checkScroll, 400); // Re-check after animation
    }
  }, [isMobile, checkScroll]);

  const handleManualInteraction = (dir: "left" | "right") => {
    setIsPaused(true);
    scroll(dir);
  };

  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    const timer = setInterval(() => {
      if (canScrollRight) {
        scroll("right");
      } else {
        // Automatically scroll back to the beginning to loop
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          setTimeout(checkScroll, 400);
        }
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, canScrollRight, scroll, checkScroll]);

  return (
    <section className="py-20 bg-background" id="our-doctors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <ScrollAnimationWrapper>
            <div>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("ourTeam")}</p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground">{t("meetOurDoctors")}</h2>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper delay={0.1}>
            <Link to="/doctors" className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 rounded-full font-body text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-300">
              {t("viewAllDoctors")}
            </Link>
          </ScrollAnimationWrapper>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm text-muted-foreground font-body">
            {lang === "ar" ? "جاري تحميل الأطباء..." : "Loading doctors..."}
          </div>
        ) : loadError ? (
          <div className="text-center py-16 text-sm text-muted-foreground font-body">
            {lang === "ar" ? "تعذر تحميل الأطباء حالياً." : "Could not load doctors right now."}
          </div>
        ) : !hasDoctors ? (
          <div className="text-center py-16 text-sm text-muted-foreground font-body">
            {lang === "ar" ? "لا يوجد أطباء متاحون حالياً." : "No doctors are available right now."}
          </div>
        ) : (
        <div className="relative group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <button
            onClick={() => handleManualInteraction("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-all shadow-md ltr-icon ${!canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary"}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleManualInteraction("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-all shadow-md ltr-icon ${!canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="max-w-[1192px] mx-auto overflow-hidden">
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex items-stretch gap-20 md:gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory px-[20px] md:px-0"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                // Precise padding to center 280px card on mobile:
                paddingLeft: "calc((100vw - 280px) / 2)",
                paddingRight: "calc((100vw - 280px) / 2)",
              }}
            >
              {/* On desktop (md), we don't want the extreme padding, so we reset it via media-query-like logic or just standard classes */}
              <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 768px) {
                  .snap-x { padding-left: 0 !important; padding-right: 0 !important; }
                }
              `}} />
              {featuredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;
