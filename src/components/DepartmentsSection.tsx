import { useState, useRef, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, X, Stethoscope, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, useInView } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { departments as staticDepartments, type Department, MAIN_CATEGORIES } from "@/data/departments";
import { loadDoctors, type Doctor } from "@/data/loadDoctors";
import { doctorMatchesDepartment } from "@/data/departments";
import { getSubSlugForDepartment, normalizeSubSlug } from "@/utils/departmentSubSlug";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
import { sortDoctorsInDepartment } from "@/utils/sortDoctorsInDepartment";
import { scrollDoctorCarousel } from "@/utils/doctorCarousel";
type DepartmentsSectionProps = {
  showPageTitle?: boolean;
};
const isAlSafwaDeptSlug = (slug: string) => slug.includes("al-safwa");
const CLINICAL_NUTRITION_SUB_SLUG = "clinical-nutrition-dietetics";
const isClinicalNutritionSubSpecialty = (dept: Department, selectedSubSlug?: string) => {
  if (!selectedSubSlug) return false;
  const normalized = normalizeSubSlug(dept.slug, selectedSubSlug);
  if (normalized === CLINICAL_NUTRITION_SUB_SLUG) return true;
  return dept.subs?.some(
    (sub) =>
      sub.name === "Clinical Nutrition & Dietetics" &&
      getSubSlugForDepartment(dept.slug, sub.name) === normalized
  );
};
const shouldShowDepartmentDoctorsHeading = (dept: Department, selectedSubSlug?: string) => {
  if (dept.name === "Clinical Pharmacy") return false;
  if (
    (dept.name === "General & Laparoscopic Surgery" || dept.name === "Internal Medicine") &&
    isClinicalNutritionSubSpecialty(dept, selectedSubSlug)
  ) {
    return false;
  }
  return true;
};
type DeptRestoreState = {
  restoreDeptOpenIndex?: number;
  restoreSelectedSubByDept?: Record<number, string>;
  restoreScrollY?: number;
  fromDepartments?: boolean;
  returnPath?: string;
};
const DepartmentsSection = ({ showPageTitle = false }: DepartmentsSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [selectedSubByDept, setSelectedSubByDept] = useState<Record<string, string>>({});
  const [departments] = useState<Department[]>(
    staticDepartments.filter((dept) => dept.name !== "Allergy & Immunology")
  );
  const doctorScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const restoreScrollYRef = useRef<number | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorCatalog, setDoctorCatalog] = useState<Doctor[]>([]);
  useEffect(() => {
    let cancelled = false;
    void loadDoctors().then((list) => {
      if (!cancelled) setDoctorCatalog(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    const state = location.state as DeptRestoreState | null;
    if (state?.restoreDeptOpenIndex == null) return;
    restoreScrollYRef.current =
      typeof state.restoreScrollY === "number" ? state.restoreScrollY : null;
    setOpenIndex(state.restoreDeptOpenIndex);
    if (state.restoreSelectedSubByDept) {
      setSelectedSubByDept(state.restoreSelectedSubByDept);
    }
  }, [location.state]);
  useEffect(() => {
    if (openIndex === null || restoreScrollYRef.current == null) return;
    const scrollY = restoreScrollYRef.current;
    const deptSlug = departments[openIndex]?.slug;
    const scrollToSavedPosition = () => {
      if (scrollY > 0) {
        window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
        return;
      }
      if (deptSlug) {
        document
          .getElementById(`dept-card-${deptSlug}`)
          ?.scrollIntoView({ block: "center", behavior: "auto" });
      }
    };
    scrollToSavedPosition();
    const raf = window.requestAnimationFrame(scrollToSavedPosition);
    const timer = window.setTimeout(() => {
      scrollToSavedPosition();
      restoreScrollYRef.current = null;
    }, 500);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [openIndex, departments]);
  const openDoctorProfile = (docId: string, origIdx: number) => {
    navigate(`/doctors/${docId}`, {
      state: {
        fromDepartments: true,
        returnPath: location.pathname,
        restoreDeptOpenIndex: origIdx,
        restoreSelectedSubByDept: selectedSubByDept,
        restoreScrollY: window.scrollY,
      },
    });
  };
  const openDepartmentDetail = (
    deptSlug: string,
    origIdx: number,
    subSlug?: string
  ) => {
    const path = subSlug
      ? `/medical-services/${deptSlug}/${subSlug}`
      : `/medical-services/${deptSlug}`;
    navigate(path, {
      state: {
        fromDepartments: true,
        returnPath: location.pathname,
        restoreDeptOpenIndex: origIdx,
        restoreSelectedSubByDept: selectedSubByDept,
        restoreScrollY: window.scrollY,
      },
    });
  };
  const openAlSafwaProgram = (origIdx: number) => {
    navigate("/al-safwa", {
      state: {
        fromDepartments: true,
        returnPath: location.pathname,
        restoreDeptOpenIndex: origIdx,
        restoreSelectedSubByDept: selectedSubByDept,
        restoreScrollY: window.scrollY,
      },
    });
  };
  const filteredDepts = departments.filter(dept => {
    const query = searchQuery.toLowerCase();
    return (
      dept.name.toLowerCase().includes(query) ||
      dept.nameAr.toLowerCase().includes(query) ||
      dept.desc.toLowerCase().includes(query) ||
      dept.descAr.toLowerCase().includes(query)
    );
  });
  const scrollDoctors = (direction: "left" | "right") => {
    if (doctorScrollRef.current) {
      scrollDoctorCarousel(doctorScrollRef.current, direction);
    }
  };
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const getSubSlug = (deptSlug: string, subName: string) =>
    getSubSlugForDepartment(deptSlug, subName);
  const selectedDept = openIndex !== null ? departments[openIndex] : null;
  const deptDoctorsMap = useMemo<Record<string, Doctor[]>>(
    () =>
      Object.fromEntries(
        departments.map((dept) => {
          const matchedDoctors = doctorCatalog.filter((doc) =>
            doctorMatchesDepartment(dept.name, doc)
          );
          return [dept.slug, matchedDoctors];
        })
      ),
    [departments, doctorCatalog]
  );
  const deptDoctors = useMemo(() => {
    if (!selectedDept) return [];
    const origIdx = openIndex!;
    const selectedSubSlug = selectedSubByDept[origIdx]
      ? normalizeSubSlug(selectedDept.slug, selectedSubByDept[origIdx])
      : undefined;
    const subSpecialtyDoctorMap: Record<string, string[]> = {
      "cardiology": ["alturki", "turki"],
      "nephrology": ["qallaf"],
      "gastroenterology": ["swait", "jaser"],
      "endocrinology-metabolism": ["ramadhan", "alroudhan", "roudhan"],
      "rheumatology": ["aldei", "dei"],
      "clinical-nutrition-dietetics": ["hachem", "khreis", "salamah"],
      "respiratory-clinic-pulmonology": ["alia", "ibrahim"],
      "allergy-and-immunology": ["othman", "yassmin"],
      "cosmetic-gynecology": ["abubakr", "elmardi", "nada", "samar", "nagaty"],
      "gynecologic-oncology": ["nourah-al-ibrahim"],
      "urogynecology": ["abubakr", "elmardi", "nada"],
      "womens-health": [],
      "physiotherapy": [],
      "parent-childbirth-education": [],
      "obesity-bariatric-surgery": ["ahmed-al-mulla", "mulla", "humoud", "alrasheedi", "hussein", "faour", "sulaiman", "almazeedi"],
      "breast-surgical-oncology": ["noha", "alsaleh"],
      "abdominal-wall-reconstruction": ["humoud", "alrasheedi", "sarah", "youha"],
      "nutrition-and-diet-surgery": ["hachem", "khreis", "salamah"],
    };
    const extraTerms: string[] = [];
    if (selectedDept.name === "Internal Medicine") {
      extraTerms.push("Nutricare");
    } else if (selectedDept.name === "General & Laparoscopic Surgery") {
      extraTerms.push("Nutricare", "La Cosmetique");
    }
    const allDeptDoctors = doctorCatalog.filter((doc) =>
      doctorMatchesDepartment(selectedDept.name, doc, extraTerms)
    );
    if (selectedSubSlug && selectedDept.subs) {
      const mapKey = Object.keys(subSpecialtyDoctorMap).find((k) => selectedSubSlug.includes(k) || k.includes(selectedSubSlug));
      if (mapKey && subSpecialtyDoctorMap[mapKey].length > 0) {
        const keywords = subSpecialtyDoctorMap[mapKey];
        const filtered = allDeptDoctors.filter((doc) =>
          keywords.some((kw) => doc.id.toLowerCase().includes(kw) || doc.name.toLowerCase().includes(kw))
        );
        if (filtered.length > 0) {
          return sortDoctorsInDepartment(filtered, selectedDept.name, lang);
        }
      }
      const selectedSub = selectedDept.subs.find(
        (s) => getSubSlugForDepartment(selectedDept.slug, s.name) === selectedSubSlug,
      );
      if (selectedSub) {
        const subKeywords = selectedSub.name.toLowerCase().split(/[\s&,/()+]+/).filter(w => w.length > 3);
        const filtered = allDeptDoctors.filter((doc) => {
          const haystack = `${doc.title} ${doc.specialty} ${doc.titleAr} ${doc.id}`.toLowerCase();
          return subKeywords.some((kw) => haystack.includes(kw));
        });
        if (filtered.length > 0) {
          return sortDoctorsInDepartment(filtered, selectedDept.name, lang);
        }
      }
    }
    const baseDoctors = deptDoctorsMap[selectedDept.name] || [];
    return sortDoctorsInDepartment(baseDoctors, selectedDept.name, lang);
  }, [deptDoctorsMap, selectedDept, openIndex, selectedSubByDept, lang, doctorCatalog]);
  useEffect(() => {
    if (doctorScrollRef.current) {
      doctorScrollRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [openIndex, selectedSubByDept, deptDoctors]);
  const getOriginalIndex = (dept: Department) =>
    departments.findIndex((d) => d.name === dept.name);
  return (
    <section className="py-16 md:py-24 bg-background" ref={sectionRef} id="departments">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          {showPageTitle && (
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4 ${
                lang === "ar" ? "dept-rtl-center" : ""
              }`}
            >
              {t("medicalServices")}
            </h1>
          )}
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("ourSpecialties")}</p>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 ${
              lang === "ar" ? "dept-rtl-center" : ""
            }`}
          >
            {t("medicalDepartments")}
          </h2>
          <p
            className={`text-muted-foreground font-body max-w-lg mx-auto text-sm md:text-base ${
              lang === "ar" ? "dept-rtl-center" : ""
            }`}
          >
            {t("deptCount")}
          </p>
        </motion.div>
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchDepartmentOnly")}
              className="pl-12 pr-4 py-6 text-base rounded-2xl border-border/60 bg-popover shadow-sm focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-14">
          {MAIN_CATEGORIES.map((cat) => {
            const catDepts = filteredDepts.filter(d => d.mainCategory === cat.key);
            if (catDepts.length === 0) return null;
            return (
              <div key={cat.key}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-border/50" />
                  <h3 className="text-base md:text-lg font-body font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-accent whitespace-nowrap px-1">
                    {lang === "ar" ? cat.labelAr : cat.label}
                  </h3>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {catDepts.map((dept) => {
                    const origIdx = getOriginalIndex(dept);
                    const isExpanded = openIndex === origIdx;
                    const selectedSubSlug = selectedSubByDept[origIdx]
                      ? normalizeSubSlug(dept.slug, selectedSubByDept[origIdx])
                      : undefined;
                    return (
                      <motion.div
                        key={dept.slug}
                        id={`dept-card-${dept.slug}`}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`bg-popover rounded-2xl border border-border/50 cursor-pointer group transition-all duration-500 ${isExpanded ? "sm:col-span-2 lg:col-span-3 overflow-visible" : "overflow-hidden"}`}
                        onClick={() => {
                          if (!isExpanded && isAlSafwaDeptSlug(dept.slug)) {
                            openAlSafwaProgram(origIdx);
                            return;
                          }
                          if (!isExpanded) handleToggle(dept.slug);
                        }}
                      >
                        {!isExpanded ? (
                          <>
                            <div className="relative h-52 md:h-60 overflow-hidden">
                              <img src={dept.img} alt={lang === "ar" ? dept.nameAr : dept.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-popover/70 to-transparent" />
                            </div>
                            <div className="p-4 md:p-5">
                              <h3 className="text-sm md:text-base font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                {lang === "ar" ? dept.nameAr : dept.name}
                              </h3>
                              <p className="text-muted-foreground font-body text-xs leading-relaxed mb-3 line-clamp-2">
                                {lang === "ar" ? dept.descAr : dept.desc}
                              </p>
                              <span className="inline-flex items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors">
                                {t("learnMore")} <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${lang === "ar" ? "rotate-180" : ""}`} />
                              </span>
                            </div>
                          </>
                        ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                            className="flex flex-col lg:flex-row" onClick={(e) => e.stopPropagation()}>
                            <div className="lg:w-2/5 relative">
                              <div className="relative h-72 lg:h-full min-h-[380px] overflow-hidden">
                                <img src={dept.img} alt={lang === "ar" ? dept.nameAr : dept.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-popover via-popover/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                  <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-2">
                                    {lang === "ar" ? dept.nameAr : dept.name}
                                  </h3>
                                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{lang === "ar" ? dept.descAr : dept.desc}</p>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isAlSafwaDeptSlug(dept.slug)) {
                                        openAlSafwaProgram(origIdx);
                                        return;
                                      }
                                      openDepartmentDetail(dept.slug, origIdx);
                                    }}
                                    className="inline-flex w-full justify-end items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors"
                                  >
                                    {t("learnMore")} <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${lang === "ar" ? "rotate-180" : ""}`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  {dept.subs && dept.subs.length > 0 && (
                                    <>
                                      <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-2">{lang === "ar" ? "التخصصات الفرعية" : "Sub-specialties"}</p>
                                      <div className="flex flex-wrap gap-2">
                                        {dept.subs.map((sub) => (
                                          <button key={sub.name} type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const subSlug = getSubSlugForDepartment(dept.slug, sub.name);
                                              const isAlreadySelected = selectedSubSlug === subSlug;
                                              if (isAlreadySelected) {
                                                setSelectedSubByDept((prev) => ({ ...prev, [dept.slug]: "" }));
                                              } else {
                                                setSelectedSubByDept((prev) => ({
                                                  ...prev,
                                                  [dept.slug]: subSlug,
                                                }));
                                              }
                                              if (doctorScrollRef.current) doctorScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${selectedSubSlug === getSubSlugForDepartment(dept.slug, sub.name) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 text-foreground border-border/30 hover:bg-secondary"}`}
                                          >
                                            {lang === "ar" ? sub.nameAr : sub.name}
                                          </button>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <button onClick={() => setOpenSlug(null)} className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0 ml-4">
                                  <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </div>
                              {deptDoctors.length > 0 && (
                                <div className="mt-auto">
                                  <p className="text-accent text-center text-xs tracking-[0.2em] uppercase font-body mb-4">
                                    {lang === "ar" ? "فريقنا الطبي" : "Our Medical Team"}
                                  </p>
                                  {shouldShowDepartmentDoctorsHeading(dept, selectedSubSlug) && (
                                    <h3 className="text-center text-lg md:text-xl font-serif text-foreground font-semibold mb-4">
                                      {t("departmentDoctors")}
                                    </h3>
                                  )}
                                  <div className="relative mx-auto w-full lg:mt-6" dir="ltr">
                                    <div className="flex items-center justify-center gap-3">
                                      {deptDoctors.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => scrollDoctors("left")}
                                          aria-label={lang === "ar" ? "التمرير لليسار" : "Scroll left"}
                                          className="hidden md:flex shrink-0 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                                        >
                                          <ChevronLeft className="w-4 h-4" />
                                        </button>
                                      )}
                                      <div
                                        className={`overflow-hidden shrink-0 ${
                                          deptDoctors.length === 1
                                            ? "w-[min(100%,280px)]"
                                            : "w-[min(100%,280px)] md:w-[576px]"
                                        }`}
                                      >
                                        <div
                                          ref={doctorScrollRef}
                                          className="dept-doctor-carousel flex gap-4 overflow-x-auto pt-2 pb-6 scroll-smooth snap-x snap-mandatory justify-start max-md:scroll-px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                        >
                                        {deptDoctors.map((doc) => (
                                          <Link
                                            to={`/doctors/${doc.id}`}
                                            key={doc.id}
                                            data-doctor-carousel-card
                                            dir={lang === "ar" ? "rtl" : "ltr"}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              openDoctorProfile(doc.id, origIdx);
                                            }}
                                            className="relative z-0 block w-[280px] shrink-0 snap-center md:snap-start hover:z-10"
                                          >
                                            <motion.div whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} className="bg-background rounded-2xl overflow-hidden border border-border/50 group/doc cursor-pointer h-full">
                                              <div className="bg-white h-48 flex items-center justify-center relative overflow-hidden">
                                                {doc.image ? <img src={doc.image} alt={getDoctorDisplayName(doc, lang)} className="w-full h-full object-cover object-top" /> : <div className="w-14 h-14 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30"><span className="text-lg font-serif text-primary-foreground">{doc.initials}</span></div>}
                                                <div className={`absolute top-2 w-6 h-6 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center ${lang === "ar" ? "left-2" : "right-2"}`}><Stethoscope className="w-3 h-3 text-primary-foreground" /></div>
                                              </div>
                                              <div className="p-3 flex flex-col text-start items-start">
                                                <p className={`text-accent text-[9px] tracking-[0.2em] font-body mb-1 w-full ${lang === "ar" ? "" : "uppercase"}`}>{lang === "ar" ? doc.specialtyAr : doc.specialty}</p>
                                                <h4 className="text-[1.2rem] font-serif font-bold text-foreground group-hover/doc:text-primary transition-colors w-full">{getDoctorDisplayName(doc, lang)}</h4>
                                                <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-1 w-full">{lang === "ar" ? doc.titleAr : doc.title}</p>
                                                <p className="text-xs text-primary font-body mt-2 inline-flex items-center gap-1">{t("viewProfile")} <ArrowRight className={`w-3 h-3 shrink-0 ${lang === "ar" ? "rotate-180" : ""}`} /></p>
                                              </div>
                                            </motion.div>
                                          </Link>
                                        ))}
                                        </div>
                                      </div>
                                      {deptDoctors.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => scrollDoctors("right")}
                                          aria-label={lang === "ar" ? "التمرير لليمين" : "Scroll right"}
                                          className="hidden md:flex shrink-0 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                                        >
                                          <ChevronRight className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                    {deptDoctors.length > 1 && (
                                      <div className="mt-2 flex justify-center gap-3 md:hidden">
                                        <button
                                          type="button"
                                          onClick={() => scrollDoctors("left")}
                                          aria-label={lang === "ar" ? "التمرير لليسار" : "Scroll left"}
                                          className="w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                                        >
                                          <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => scrollDoctors("right")}
                                          aria-label={lang === "ar" ? "التمرير لليمين" : "Scroll right"}
                                          className="w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                                        >
                                          <ChevronRight className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  {dept.subs && dept.subs.length > 0 && selectedSubSlug && (
                                    <div className="mt-4 text-center">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openDepartmentDetail(
                                            dept.slug,
                                            origIdx,
                                            selectedSubSlug
                                          )
                                        }
                                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                                      >
                                        {t("learnMore")} <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${lang === "ar" ? "rotate-180" : ""}`} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {filteredDepts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body">{lang === "ar" ? "لم يتم العثور على أقسام تطابق بحثك." : "No departments found matching your search."}</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .dept-rtl-center {
          direction: rtl;
          text-align: center;
        }
      `}</style>
    </section>
  );
};
export default DepartmentsSection;
