import { useState, useRef, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, X, Stethoscope, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDepartmentSubspecialitiesAndDoctors } from "@/api/department";
import { fetchMappedDoctorsBySubspeciality } from "@/api/doctors";
import { getCatagoriesWithDepartmentsAndDoctors } from "@/api/catagory";
import type { Department } from "@/types/department";
import type { Doctor } from "@/types/doctor";
import {
  mapCategoriesToDisplaySections,
  type CategoryDisplaySection,
} from "@/utils/mapApiDepartment";
import {
  getDepartmentCardCacheKey,
  getDepartmentLookupId,
  mapApiDepartmentDetailResponse,
  mapApiSubspecialitiesToDepartmentSubs,
} from "@/utils/mapApiDepartmentDetail";
import { normalizeSubSlug, slugifySubName } from "@/utils/departmentSubSlug";
import {
  shouldShowDepartmentDoctorsHeading,
} from "@/utils/clinicalNutritionSubspeciality";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
import { sortDoctorsInDepartment } from "@/utils/sortDoctorsInDepartment";
import { scrollDoctorCarousel } from "@/utils/doctorCarousel";
type DepartmentsSectionProps = {
  showPageTitle?: boolean;
};
const isAlSafwaDeptSlug = (slug: string) => slug.includes("al-safwa");
type DeptRestoreState = {
  restoreDeptOpenIndex?: number;
  restoreSelectedSubByDept?: Record<number, string>;
  restoreScrollY?: number;
  fromDepartments?: boolean;
  returnPath?: string;
};
type DeptCardData = {
  subs: NonNullable<Department["subs"]>;
  doctors: Doctor[];
  fromApi: boolean;
};
const DepartmentsSection = ({ showPageTitle = false }: DepartmentsSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedSubByDept, setSelectedSubByDept] = useState<Record<number, string>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categorySections, setCategorySections] = useState<CategoryDisplaySection[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState("");
  const doctorScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const restoreScrollYRef = useRef<number | null>(null);
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [deptCardCache, setDeptCardCache] = useState<Record<string, DeptCardData>>({});
  const [loadingDeptKey, setLoadingDeptKey] = useState<string | null>(null);
  const [subspecialityDoctorsCache, setSubspecialityDoctorsCache] = useState<Record<string, Doctor[]>>({});
  const [loadingSubspecialityKey, setLoadingSubspecialityKey] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    setDepartmentsLoading(true);
    setDepartmentsError("");
    void getCatagoriesWithDepartmentsAndDoctors()
      .then((categories) => {
        if (cancelled) return;
        const sections = mapCategoriesToDisplaySections(categories);
        setCategorySections(sections);
        setDepartments(sections.flatMap((section) => section.departments));
      })
      .catch(() => {
        if (!cancelled) {
          setCategorySections([]);
          setDepartments([]);
          setDepartmentsError("Failed to load departments.");
        }
      })
      .finally(() => {
        if (!cancelled) setDepartmentsLoading(false);
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
    if (openIndex === null) return;
    const dept = departments[openIndex];
    if (!dept) return;

    const cacheKey = getDepartmentCardCacheKey(dept);
    if (deptCardCache[cacheKey]) return;

    const lookupId = getDepartmentLookupId(dept);
    if (!lookupId) return;

    let cancelled = false;
    setLoadingDeptKey(cacheKey);

    void getDepartmentSubspecialitiesAndDoctors(lookupId)
      .then((response) => {
        if (cancelled || !response?.success || !response.data) return;

        const mapped = mapApiDepartmentDetailResponse(response.data, dept.slug);
        const apiSubs = mapApiSubspecialitiesToDepartmentSubs(response.data.subspecialities ?? []);

        setDeptCardCache((prev) => ({
          ...prev,
          [cacheKey]: {
            subs: apiSubs,
            doctors: mapped.doctors,
            fromApi: true,
          },
        }));
        setDepartments((prev) =>
          prev.map((item) =>
            getDepartmentCardCacheKey(item) === cacheKey ? { ...item, subs: apiSubs } : item,
          ),
        );
      })
      .catch(() => {
        /* card stays empty until API succeeds */
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDeptKey((current) => (current === cacheKey ? null : current));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [openIndex, departments, deptCardCache]);
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
    subSlug?: string,
    departmentMongoId?: string
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
        departmentMongoId,
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
  const filteredSections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return categorySections;

    return categorySections
      .map((section) => ({
        ...section,
        departments: section.departments.filter(
          (dept) =>
            dept.name.toLowerCase().includes(query) ||
            dept.nameAr.toLowerCase().includes(query) ||
            dept.desc.toLowerCase().includes(query) ||
            dept.descAr.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.departments.length > 0);
  }, [categorySections, searchQuery]);
  const scrollDoctors = (direction: "left" | "right") => {
    if (doctorScrollRef.current) {
      scrollDoctorCarousel(doctorScrollRef.current, direction);
    }
  };
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const getSubSlug = (subName: string) => slugifySubName(subName);
  const normalizeCardSubSlug = (dept: Department, subSlug: string, cardData?: DeptCardData) =>
    normalizeSubSlug(
      dept.slug,
      subSlug,
      (cardData?.subs ?? dept.subs)?.map((sub) => ({
        slug: slugifySubName(sub.name),
        name: sub.name,
      })),
    );
  const selectedDept = openIndex !== null ? departments[openIndex] : null;
  const selectedCardData = selectedDept ? deptCardCache[getDepartmentCardCacheKey(selectedDept)] : undefined;
  const selectedCardLoading = selectedDept
    ? loadingDeptKey === getDepartmentCardCacheKey(selectedDept)
    : false;

  useEffect(() => {
    if (openIndex === null) return;
    const dept = departments[openIndex];
    if (!dept) return;

    const rawSubSlug = selectedSubByDept[openIndex];
    if (!rawSubSlug) return;

    const cardData = deptCardCache[getDepartmentCardCacheKey(dept)];
    const cardSubs = cardData?.subs ?? dept.subs ?? [];
    if (cardSubs.length === 0) return;

    const selectedSubSlug = normalizeCardSubSlug(dept, rawSubSlug, cardData);
    const selectedSub = cardSubs.find((sub) => getSubSlug(sub.name) === selectedSubSlug);
    if (!selectedSub?.subspecialityId) return;

    const cacheKey = `${getDepartmentCardCacheKey(dept)}:${selectedSub.subspecialityId}`;
    if (subspecialityDoctorsCache[cacheKey]) return;

    let cancelled = false;
    setLoadingSubspecialityKey(cacheKey);

    void fetchMappedDoctorsBySubspeciality(
      selectedSub.subspecialityId,
      dept.name,
      dept.nameAr,
    )
      .then((doctors) => {
        if (cancelled) return;
        setSubspecialityDoctorsCache((prev) => ({ ...prev, [cacheKey]: doctors }));
      })
      .catch(() => {
        if (!cancelled) {
          setSubspecialityDoctorsCache((prev) => ({ ...prev, [cacheKey]: [] }));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSubspecialityKey((current) => (current === cacheKey ? null : current));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [openIndex, departments, selectedSubByDept, deptCardCache, subspecialityDoctorsCache]);

  const deptDoctors = useMemo(() => {
    if (!selectedDept) return [];
    if (selectedCardLoading) return [];
    const origIdx = openIndex!;
    const cardData = selectedCardData;
    const cardSubs = cardData?.subs ?? selectedDept.subs ?? [];
    const selectedSubSlug = selectedSubByDept[origIdx]
      ? normalizeCardSubSlug(selectedDept, selectedSubByDept[origIdx], cardData)
      : undefined;
    const allDeptDoctors = cardData?.doctors ?? [];

    if (selectedSubSlug && cardSubs.length > 0) {
      const selectedSub = cardSubs.find((sub) => getSubSlug(sub.name) === selectedSubSlug);
      if (selectedSub?.subspecialityId) {
        const cacheKey = `${getDepartmentCardCacheKey(selectedDept)}:${selectedSub.subspecialityId}`;
        const subspecialityDoctors = subspecialityDoctorsCache[cacheKey];
        if (!subspecialityDoctors) return [];
        return sortDoctorsInDepartment(subspecialityDoctors, selectedDept.name, lang);
      }
    }

    return sortDoctorsInDepartment(allDeptDoctors, selectedDept.name, lang);
  }, [
    selectedDept,
    selectedCardData,
    selectedCardLoading,
    openIndex,
    selectedSubByDept,
    subspecialityDoctorsCache,
    lang,
  ]);

  const selectedSubspecialityLoading = useMemo(() => {
    if (!selectedDept || openIndex === null) return false;
    const cardData = selectedCardData;
    const cardSubs = cardData?.subs ?? selectedDept.subs ?? [];
    const rawSubSlug = selectedSubByDept[openIndex];
    if (!rawSubSlug || cardSubs.length === 0) return false;
    const selectedSubSlug = normalizeCardSubSlug(selectedDept, rawSubSlug, cardData);
    const selectedSub = cardSubs.find((sub) => getSubSlug(sub.name) === selectedSubSlug);
    if (!selectedSub?.subspecialityId) return false;
    const cacheKey = `${getDepartmentCardCacheKey(selectedDept)}:${selectedSub.subspecialityId}`;
    return loadingSubspecialityKey === cacheKey;
  }, [
    selectedDept,
    selectedCardData,
    openIndex,
    selectedSubByDept,
    loadingSubspecialityKey,
  ]);
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
          animate={{ opacity: 1, y: 0 }}
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
        {departmentsLoading && (
          <div className="flex min-h-[30vh] items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
            <span className="sr-only">Loading departments...</span>
          </div>
        )}
        {departmentsError && !departmentsLoading && (
          <p className="text-center text-muted-foreground font-body">{departmentsError}</p>
        )}
        <div className="space-y-14">
          {filteredSections.map((section) => (
              <div key={section.sectionKey}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-border/50" />
                  <h3 className="text-base md:text-lg font-body font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-accent whitespace-nowrap px-1">
                    {lang === "ar" ? section.labelAr : section.label}
                  </h3>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {section.departments.map((dept) => {
                    const origIdx = getOriginalIndex(dept);
                    const isExpanded = openIndex === origIdx;
                    const cardData = deptCardCache[getDepartmentCardCacheKey(dept)];
                    const cardSubs = cardData?.subs ?? dept.subs ?? [];
                    const isCardLoading =
                      isExpanded &&
                      loadingDeptKey === getDepartmentCardCacheKey(dept) &&
                      !cardData;
                    const selectedSubSlug = selectedSubByDept[origIdx]
                      ? normalizeCardSubSlug(dept, selectedSubByDept[origIdx], cardData)
                      : undefined;
                    const selectedSub = selectedSubSlug
                      ? cardSubs.find((sub) => slugifySubName(sub.name) === selectedSubSlug)
                      : undefined;
                    const doctorsHeadingOpts = {
                      subName: selectedSub?.name,
                      subSlug: selectedSubSlug,
                      deptSlug: dept.slug,
                      subs: cardSubs.map((sub) => ({ name: sub.name })),
                    };
                    const showDeptDoctorsHeading = shouldShowDepartmentDoctorsHeading(
                      dept.name,
                      doctorsHeadingOpts,
                    );
                    return (
                      <motion.div
                        key={dept.name}
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
                          if (!isExpanded) handleToggle(origIdx);
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
                                      openDepartmentDetail(dept.slug, origIdx, undefined, dept.mongoId);
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
                                  {isCardLoading ? (
                                    <div className="flex items-center gap-2 text-muted-foreground py-2">
                                      <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                                      <span className="font-body text-xs">
                                        {lang === "ar" ? "جاري التحميل..." : "Loading..."}
                                      </span>
                                    </div>
                                  ) : cardSubs.length > 0 ? (
                                    <>
                                      <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-2">{lang === "ar" ? "التخصصات الفرعية" : "Sub-specialties"}</p>
                                      <div className="flex flex-wrap gap-2">
                                        {cardSubs.map((sub) => (
                                          <button key={sub.name} type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const subSlug = getSubSlug(sub.name);
                                              const isAlreadySelected = selectedSubSlug === subSlug;
                                              setSelectedSubByDept((prev) => ({ ...prev, [origIdx]: isAlreadySelected ? "" : subSlug }));
                                              if (doctorScrollRef.current) doctorScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${selectedSubSlug === getSubSlug(sub.name) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 text-foreground border-border/30 hover:bg-secondary"}`}
                                          >
                                            {lang === "ar" ? sub.nameAr : sub.name}
                                          </button>
                                        ))}
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                                <button onClick={() => setOpenIndex(null)} className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0 ml-4">
                                  <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </div>
                              {!isCardLoading && selectedSubspecialityLoading && (
                                <div className="mt-auto flex items-center justify-center gap-2 text-muted-foreground py-8">
                                  <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
                                  <span className="font-body text-xs">
                                    {lang === "ar" ? "جاري تحميل الأطباء..." : "Loading doctors..."}
                                  </span>
                                </div>
                              )}
                              {!isCardLoading && !selectedSubspecialityLoading && deptDoctors.length > 0 && (
                                <div className="mt-auto">
                                  <p className="text-accent text-center text-xs tracking-[0.2em] uppercase font-body mb-4">
                                    {lang === "ar" ? "فريقنا الطبي" : "Our Medical Team"}
                                  </p>
                                  {showDeptDoctorsHeading && (
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
                                  {cardSubs.length > 0 && selectedSubSlug && (
                                    <div className="mt-4 text-center">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openDepartmentDetail(
                                            dept.slug,
                                            origIdx,
                                            selectedSubSlug,
                                            dept.mongoId
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
            ))}
          {filteredSections.length === 0 && !departmentsLoading && !departmentsError && (
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
