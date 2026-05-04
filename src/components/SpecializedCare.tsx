import { ArrowRight, ChevronLeft, ChevronRight, X, Stethoscope } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import type { Doctor } from "@/data/doctors";
import { departmentDetails } from "@/data/departmentDetails";
import { getCatagoriesWithDepartmentsAndDoctors } from "@/api/catagory";
import {
  mapCategoriesToGroupedMedicalDepartments,
  type DepartmentWithEmbeddedDoctors,
} from "@/utils/mapMedicalCatalogFromApi";

interface ServiceItem {
  num: string;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  img: string;
  slug: string;
  department: string;
  subspecialties: { name: string; nameAr: string }[];
  doctors: Doctor[];
}

const SpecializedCare = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedSubByService, setSelectedSubByService] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const INITIAL_COUNT = 6;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [apiServices, setApiServices] = useState<ServiceItem[]>([]);

  const sortedServices = [...apiServices]
    .filter((service) => service.name !== "Allergy & Immunology")
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const categories = await getCatagoriesWithDepartmentsAndDoctors();
        const grouped = mapCategoriesToGroupedMedicalDepartments(categories);
        const departments: DepartmentWithEmbeddedDoctors[] = grouped.flatMap((g) => g.departments);
        const mapped: ServiceItem[] = departments.map((dep, index) => {
          const detail = departmentDetails.find((d) => d.slug === dep.slug);
          return {
            num: String(index + 1).padStart(2, "0"),
            name: dep.name,
            nameAr: dep.nameAr || dep.name,
            desc: dep.desc || dep.name,
            descAr: dep.descAr || dep.desc || dep.name,
            img: dep.img || "",
            slug: dep.slug,
            department: dep.name,
            subspecialties:
              dep.subs.length > 0
                ? dep.subs
                : (detail?.subDepartments ?? []).map((sub) => ({ name: sub.name, nameAr: sub.nameAr })),
            doctors: (dep.embeddedDoctors ?? []).slice(0, 3),
          };
        });
        if (!cancelled) setApiServices(mapped);
      } catch {
        if (!cancelled) setApiServices([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollDoctors = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 768;
      // On mobile, card is 280 and gap is 80
      // On desktop, card is 280 and gap is 16 (gap-4)
      const amount = isMobile ? (280 + 80) : (280 + 16);
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleExpand = (index: number) => {
    if (index < 0 || index >= INITIAL_COUNT) return;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const visibleServices = sortedServices.slice(0, INITIAL_COUNT);

  // Reorder: expanded card first, rest below
  const reorderedServices = (expandedIndex !== null && !isMobile && expandedIndex < visibleServices.length)
    ? [visibleServices[expandedIndex], ...visibleServices.filter((_, idx) => idx !== expandedIndex)]
    : visibleServices;

  const getOriginalIndex = (service: ServiceItem) =>
    sortedServices.findIndex((s) => s.num === service.num);

  const isInFirstSix = (origIdx: number) => origIdx < INITIAL_COUNT;

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const getDepartmentSlug = (service: ServiceItem) => {
    return service.slug;
  };

  const getSubSlug = (service: ServiceItem, subName: string) => {
    const departmentSlug = getDepartmentSlug(service);
    if (!departmentSlug) return slugify(subName);
    const dept = departmentDetails.find((d) => d.slug === departmentSlug);
    const matchedSub = dept?.subDepartments?.find((sub) => sub.name.toLowerCase() === subName.toLowerCase());
    return matchedSub?.slug ?? slugify(subName);
  };

  return (
    <section className="py-16 md:py-20 bg-background" id="services" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
          <ScrollAnimationWrapper>
            <div>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("whatWeOffer")}</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground">{t("specializedCare")}</h2>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper delay={0.15}>
            <p className="text-muted-foreground font-body max-w-md mt-4 md:mt-0 leading-relaxed text-sm">
              {t("specializedDesc")}
            </p>
          </ScrollAnimationWrapper>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reorderedServices.map((s) => {
            const origIdx = getOriginalIndex(s);
            const isExpanded = expandedIndex === origIdx;
            const deptDoctors = s.doctors;
            const showImageCard = isInFirstSix(origIdx);
            const selectedSubSlug = selectedSubByService[s.num];
            const departmentSlug = getDepartmentSlug(s);

            return (
              <motion.div
                key={s.num}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.4,
                  delay: isExpanded ? 0 : Math.min(origIdx * 0.04, 0.6),
                  ease: [0.25, 0.46, 0.45, 0.94],
                  layout: { duration: 0.4, ease: "easeInOut" }
                }}
                className={`bg-popover rounded-2xl overflow-hidden border border-border/50 cursor-pointer group transition-all duration-500 ${isExpanded ? "sm:col-span-2 lg:col-span-3 shadow-xl z-20" : "hover:border-primary/30 z-10"
                  }`}
                onClick={() => !isExpanded && handleExpand(origIdx)}
              >
                <AnimatePresence mode="wait">
                  {!isExpanded ? (
                    <motion.div
                      key="collapsed"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {showImageCard ? (
                        /* First 6: Image cards */
                        <>
                          <div className="relative h-52 md:h-60 overflow-hidden">
                            {s.img ? (
                              <img
                                src={s.img}
                                alt={lang === "ar" ? s.nameAr : s.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                                <Stethoscope className="w-8 h-8 text-primary/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-popover/70 to-transparent" />
                            <span className="absolute top-3 left-3 text-2xl font-serif text-primary-foreground/80 drop-shadow-lg"></span>
                          </div>
                          <div className="p-4 md:p-5">
                            <h3 className="text-sm md:text-base font-serif text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                              {lang === "ar" ? s.nameAr : s.name}
                            </h3>
                            <p className="text-muted-foreground font-body text-xs leading-relaxed mb-3 line-clamp-2">
                              {(lang === "ar" ? s.descAr : s.desc) || (lang === "ar" ? "قسم طبي" : "Medical department")}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors">
                              {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </>
                      ) : (
                        /* Remaining: compact pill style */
                        <div className="p-4 md:p-5 flex items-center gap-3">
                          <span className="text-lg font-serif text-primary/40 flex-shrink-0"></span>
                          <div className="min-w-0">
                            <h3 className="text-xs md:text-sm font-serif text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                              {lang === "ar" ? s.nameAr : s.name}
                            </h3>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-auto" />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    /* Expanded Panel */
                    <motion.div
                      key="expanded"
                      layout
                      initial={{ opacity: 0, height: isMobile ? 0 : "auto" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="flex flex-col lg:flex-row"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Left: Image + Info */}
                      <div className="lg:w-2/5 relative">
                        <div className="relative h-72 lg:h-full min-h-[380px] overflow-hidden">
                          {s.img ? (
                            <img
                              src={s.img}
                              alt={lang === "ar" ? s.nameAr : s.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                              <Stethoscope className="w-10 h-10 text-primary/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-popover via-popover/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <span className="text-4xl font-serif text-primary/60 mb-2 block"></span>
                            <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2">
                              {lang === "ar" ? s.nameAr : s.name}
                            </h3>
                            <p className="text-muted-foreground font-body text-sm leading-relaxed">
                              {(lang === "ar" ? s.descAr : s.desc) || (lang === "ar" ? "قسم طبي" : "Medical department")}
                            </p>
                            {departmentSlug && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/medical-services/${departmentSlug}`);
                                }}
                                className="inline-flex w-full justify-end items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors mt-3"
                              >
                                {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                         
                        </div>
                      </div>

                      {/* Right: Sub-specialties + Doctors */}
                      <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col">
                        {/* Close button */}
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            {s.subspecialties.length > 0 && (
                              <>
                                <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-2">
                                  {lang === "ar" ? "التخصصات الفرعية" : "Sub-specialties"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {s.subspecialties.map((sub) => (
                                    <button
                                      key={sub.name}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const subSlug = getSubSlug(s, sub.name);
                                        setSelectedSubByService((prev) => ({ ...prev, [s.num]: subSlug }));
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                                        selectedSubSlug === getSubSlug(s, sub.name)
                                          ? "bg-primary text-primary-foreground border-primary"
                                          : "bg-secondary/50 text-foreground border-border/30 hover:bg-secondary"
                                      }`}
                                    >
                                      {lang === "ar" ? sub.nameAr : sub.name}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                            {s.subspecialties.length === 0 && (
                              <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-lg">
                                {lang === "ar" ? s.descAr : s.desc}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => setExpandedIndex(null)}
                            className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0 ml-4"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>

                        {/* Doctors */}
                        {deptDoctors.length > 0 && (
                          <div className="mt-auto">
                            <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-4">
                              {lang === "ar" ? "أطباؤنا المتخصصون" : "Department Doctors"}
                            </p>
                            <div className="relative max-w-[576px] mx-auto">
                              {deptDoctors.length > (isMobile ? 1 : 2) && (
                                <>
                                  <button
                                    onClick={() => scrollDoctors("left")}
                                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => scrollDoctors("right")}
                                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <div
                                ref={scrollRef}
                                className={`flex gap-4 overflow-x-auto pb-6 px-[20px] md:px-0 scroll-smooth snap-x snap-mandatory specialized-doctor-carousel ${deptDoctors.length <= 2 ? 'lg:justify-center' : 'lg:justify-start'}`}
                                style={{
                                  scrollbarWidth: "none",
                                  msOverflowStyle: "none",
                                }}
                              >
                                <style dangerouslySetInnerHTML={{
                                  __html: `
                                .specialized-doctor-carousel {
                                  padding-left: calc((100vw - 280px) / 2);
                                  padding-right: calc((100vw - 280px) / 2);
                                }
                                @media (min-width: 1024px) {
                                  .specialized-doctor-carousel { 
                                    padding-left: 0 !important; 
                                    padding-right: 0 !important; 
                                  }
                                }
                              `}} />
                                {deptDoctors.map((doc) => (
                                  <motion.div
                                    key={doc.id}
                                    whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => navigate(`/doctors/${doc.id}`)}
                                    className="flex-shrink-0 w-[280px] md:w-[280px] bg-background rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer group/doc snap-center md:snap-start h-full"
                                  >
                                    <div className="bg-white h-48 flex items-center justify-center relative overflow-hidden">
                                      {doc.image ? (
                                        <img
                                          src={doc.image}
                                          alt={lang === "ar" ? doc.nameAr : doc.name}
                                          className="w-full h-full object-cover object-top"
                                        />
                                      ) : (
                                        <div className="w-14 h-14 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30">
                                          <span className="text-lg font-serif text-primary-foreground">{doc.initials}</span>
                                        </div>
                                      )}
                                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center">
                                        <Stethoscope className="w-3 h-3 text-primary-foreground" />
                                      </div>
                                    </div>
                                    <div className="p-3">
                                      <p className="text-accent text-[9px] tracking-[0.2em] uppercase font-body mb-1 line-clamp-1">
                                        {lang === "ar" ? doc.specialtyAr : doc.specialty}
                                      </p>
                                      <h4 className="text-sm font-serif font-semibold text-foreground group-hover/doc:text-primary transition-colors line-clamp-1">
                                        {lang === "ar" ? doc.nameAr : doc.name}
                                      </h4>
                                      <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-1">
                                        {lang === "ar" ? doc.titleAr : doc.title}
                                      </p>
                                      <p className="text-xs text-primary font-body mt-2 inline-flex items-center gap-1 transition-colors group-hover/doc:text-accent">
                                        {t("viewProfile")} <ArrowRight className="w-3 h-3" />
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/30 flex justify-center">
                              {s.subspecialties.length > 0 && selectedSubSlug && departmentSlug && (
                                <button
                                  onClick={() => navigate(`/medical-services/${departmentSlug}/${selectedSubSlug}`)}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-full hover:bg-primary/90 transition-colors"
                                >
                                  {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Show All Departments button — navigates to full page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={() => navigate("/departments")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary font-body text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {lang === "ar" ? "عرض جميع الأقسام" : "Show All Departments"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecializedCare;
