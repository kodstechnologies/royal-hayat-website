import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, X, Stethoscope, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { departments as staticDepartments, type Department, MAIN_CATEGORIES } from "@/data/departments";
import { doctors, type Doctor } from "@/data/doctors";
import { deptDoctorAliases } from "@/data/departments";
import type {
  DepartmentWithEmbeddedDoctors,
  MedicalCategoryGroup,
} from "@/utils/mapMedicalCatalogFromApi";
import { getSubSlugForDepartment } from "@/utils/departmentSubSlug";
import { Skeleton } from "@/components/ui/skeleton";
import { getDoctorsBySubspeciality, mapApiDoctorRowToDoctor } from "@/api/doctors";

export type FetchDoctorsBySubspecialityFn = (
  subspecialityId: string,
  opts?: { page?: number; limit?: number },
) => Promise<Record<string, unknown>[]>;

export type DepartmentsSectionProps = {
  /** Flat list from API; ignored when `apiGroupedCatalog` is set. */
  apiCatalog?: DepartmentWithEmbeddedDoctors[] | null;
  /** When set, each category is a subheading with only its departments underneath. */
  apiGroupedCatalog?: MedicalCategoryGroup[] | null;
  apiCatalogLoading?: boolean;
  /** When true, never fall back to built-in static departments (use with Medical Services API). */
  disableStaticFallback?: boolean;
  /** When true, show a load failure message instead of an empty catalog (requires `disableStaticFallback`). */
  catalogFetchFailed?: boolean;
  /** When using `apiGroupedCatalog`, show a compact doctor strip on each collapsed department card. */
  showDepartmentDoctorsOnCards?: boolean;
  /**
   * Loads doctors for a subspeciality pill (defaults to `getDoctorsBySubspeciality` from `@/api/doctors`).
   * Pass from pages so Medical Services / Departments explicitly use that API.
   */
  fetchDoctorsBySubspeciality?: FetchDoctorsBySubspecialityFn;
  /** When true, show the page-level "Medical Services" heading above the section title. */
  showPageTitle?: boolean;
};

const DepartmentsSection = ({
  apiCatalog,
  apiGroupedCatalog,
  apiCatalogLoading = false,
  disableStaticFallback = false,
  catalogFetchFailed = false,
  showDepartmentDoctorsOnCards = false,
  fetchDoctorsBySubspeciality = getDoctorsBySubspeciality,
  showPageTitle = false,
}: DepartmentsSectionProps = {}) => {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [selectedSubByDept, setSelectedSubByDept] = useState<Record<string, string>>({});
  /** When set for a department slug, carousel shows doctors from GET /doctors/subspeciality/:id */
  const [subDoctorsByDept, setSubDoctorsByDept] = useState<Record<string, Doctor[]>>({});
  const [subDoctorsLoadingByDept, setSubDoctorsLoadingByDept] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (openSlug === null) {
      setSubDoctorsByDept({});
      setSubDoctorsLoadingByDept({});
    }
  }, [openSlug]);

  const rowDepartmentMongoId = (row: Record<string, unknown>): string => {
    const d = row.department;
    if (d && typeof d === "object" && "_id" in d) {
      return String((d as { _id: unknown })._id);
    }
    return String(d ?? "");
  };

  const fetchDoctorsForSubspeciality = useCallback(async (dept: Department, subspecialityId: string) => {
    const slug = dept.slug;
    const withApi = dept as DepartmentWithEmbeddedDoctors;
    const deptMongoId = withApi.apiDepartmentId?.trim() || "";
    setSubDoctorsLoadingByDept((p) => ({ ...p, [slug]: true }));
    try {
      const rows = await fetchDoctorsBySubspeciality(subspecialityId, { limit: 100 });
      const scoped =
        deptMongoId !== ""
          ? rows.filter((row) => rowDepartmentMongoId(row as Record<string, unknown>) === deptMongoId)
          : rows;
      const mapped = scoped.map((row) =>
        mapApiDoctorRowToDoctor(row, dept.name, dept.nameAr),
      );
      setSubDoctorsByDept((p) => ({ ...p, [slug]: mapped }));
    } catch {
      setSubDoctorsByDept((p) => ({ ...p, [slug]: [] }));
    } finally {
      setSubDoctorsLoadingByDept((p) => ({ ...p, [slug]: false }));
    }
  }, [fetchDoctorsBySubspeciality]);

  const selectSubspecialityPill = useCallback(
    (dept: Department, sub: { name: string; nameAr: string; subspecialityId?: string }) => {
      const subSlug = getSubSlugForDepartment(dept.slug, sub.name);
      setSelectedSubByDept((prev) => ({ ...prev, [dept.slug]: subSlug }));
      if (sub.subspecialityId) {
        void fetchDoctorsForSubspeciality(dept, sub.subspecialityId);
      } else {
        setSubDoctorsByDept((p) => {
          const next = { ...p };
          delete next[dept.slug];
          return next;
        });
        setSubDoctorsLoadingByDept((p) => {
          const next = { ...p };
          delete next[dept.slug];
          return next;
        });
      }
    },
    [fetchDoctorsForSubspeciality],
  );

  const useGroupedLayout = apiGroupedCatalog !== undefined && apiGroupedCatalog !== null;

  const departments = useMemo<Department[]>(() => {
    if (useGroupedLayout) return apiGroupedCatalog.flatMap((g) => g.departments);
    if (apiCatalog !== undefined && apiCatalog !== null) return apiCatalog;
    if (disableStaticFallback) return [];
    return staticDepartments.filter((dept) => dept.name !== "Allergy & Immunology");
  }, [apiCatalog, apiGroupedCatalog, useGroupedLayout, disableStaticFallback]);
  const doctorScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

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
      const isMobile = window.innerWidth < 768;
      // On mobile, card is 280 and gap is 80
      // On desktop, card is 280 and gap is 16 (gap-4)
      const amount = isMobile ? (280 + 80) : (280 + 16);
      doctorScrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleToggle = (slug: string) => {
    setOpenSlug((prev) => (prev === slug ? null : slug));
  };

  const selectedDept =
    openSlug !== null ? departments.find((d) => d.slug === openSlug) ?? null : null;
  const deptDoctorsMap = useMemo<Record<string, Doctor[]>>(
    () =>
      Object.fromEntries(
        departments.map((dept) => {
          const withEmb = dept as DepartmentWithEmbeddedDoctors;
          if (withEmb.embeddedDoctors !== undefined) {
            return [dept.slug, withEmb.embeddedDoctors];
          }
          const aliases = deptDoctorAliases[dept.name];
          const matchTerms = aliases && aliases.length > 0 ? aliases : [dept.name];
          const matchedDoctors = doctors.filter((doc) =>
            matchTerms.some((alias) => doc.department.includes(alias) || doc.specialty.includes(alias))
          );
          return [dept.slug, matchedDoctors];
        })
      ),
    [departments]
  );
  const deptDoctors = useMemo(() => {
    if (!selectedDept) return [];
    const apiDoctors = subDoctorsByDept[selectedDept.slug];
    if (apiDoctors !== undefined) {
      return [...apiDoctors].sort((a, b) =>
        (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en"),
      );
    }
    const selectedSubSlug = selectedSubByDept[selectedDept.slug];

    // Explicit sub-specialty → doctor name keywords map for reliable filtering
    const subSpecialtyDoctorMap: Record<string, string[]> = {
      // Internal Medicine subs
      "cardiology": ["alturki", "turki"],
      "nephrology": ["qallaf"],
      "gastroenterology": ["swait", "jaser"],
      "endocrinology-and-metabolism": ["ramadhan", "alroudhan", "roudhan"],
      "rheumatology": ["aldei", "dei"],
      "clinical-nutrition-and-dietetics": ["hachem", "khreis", "salamah"],
      "respiratory-clinic-pulmonology": ["alia", "ibrahim"],
      "allergy-and-immunology": ["othman", "yassmin"],
      // OB/GYN subs
      "cosmetic-gynecology": ["abubakr", "elmardi", "nada", "samar", "nagaty"],
      "gynecologic-oncology": ["nourah-al-ibrahim"],
      "urogynecology": ["abubakr", "elmardi", "nada"],
      "women-s-health": [], // All OBGYN doctors
      "physiotherapy": [],
      "parent-and-childbirth-education": [],
      // General & Laparoscopic Surgery subs
      "obesity-bariatric-surgery": ["ahmed-al-mulla", "mulla", "humoud", "alrasheedi", "hussein", "faour", "sulaiman", "almazeedi"],
      "breast-surgical-oncology": ["noha", "alsaleh"],
      "abdominal-wall-reconstruction": ["humoud", "alrasheedi", "sarah", "youha"],
      "nutrition-and-diet-surgery": ["hachem", "khreis", "salamah"],
    };

    // Build all doctors pool — include Nutricare for Clinical Nutrition sub
    const aliases = deptDoctorAliases[selectedDept.name];
    const matchTerms = aliases && aliases.length > 0 ? aliases : [selectedDept.name];
    // For Internal Medicine, also pull Nutricare doctors
    // For General Surgery, also pull Nutricare and La Cosmetique doctors
    const extraTerms: string[] = [];
    if (selectedDept.name === "Internal Medicine") {
      extraTerms.push("Nutricare");
    } else if (selectedDept.name === "General & Laparoscopic Surgery") {
      extraTerms.push("Nutricare", "La Cosmetique");
    }
    const allTerms = [...matchTerms, ...extraTerms];
    const allDeptDoctors = doctors.filter((doc) =>
      allTerms.some((alias) => doc.department.includes(alias) || doc.specialty.includes(alias))
    );

    if (selectedSubSlug && selectedDept.subs) {
      // Try explicit map first
      const mapKey = Object.keys(subSpecialtyDoctorMap).find((k) => selectedSubSlug.includes(k) || k.includes(selectedSubSlug));
      if (mapKey && subSpecialtyDoctorMap[mapKey].length > 0) {
        const keywords = subSpecialtyDoctorMap[mapKey];
        const filtered = allDeptDoctors.filter((doc) =>
          keywords.some((kw) => doc.id.toLowerCase().includes(kw) || doc.name.toLowerCase().includes(kw))
        );
        if (filtered.length > 0) {
          return [...filtered].sort((a, b) =>
            (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en")
          );
        }
      }

      // Fallback: keyword match on title/specialty
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
          return [...filtered].sort((a, b) =>
            (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en")
          );
        }
      }
    }

    // No sub selected or no match — show all dept doctors (excluding Nutricare unless sub selected)
    const baseDoctors = deptDoctorsMap[selectedDept.slug] || [];
    return [...baseDoctors].sort((a, b) =>
      (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en"),
    );
  }, [deptDoctorsMap, selectedDept, selectedSubByDept, subDoctorsByDept, lang]);

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
              className={`text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-4 ${
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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchSymptoms")}
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
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-border/50" />
                  <h3 className="text-base md:text-lg font-body font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-accent whitespace-nowrap px-1">
                    {lang === "ar" ? cat.labelAr : cat.label}
                  </h3>
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {catDepts.map((dept) => {
                    const isExpanded = openSlug === dept.slug;
                    const selectedSubSlug = selectedSubByDept[dept.slug];
                    const subDoctorsLoading = Boolean(subDoctorsLoadingByDept[dept.slug]);

                    return (
                      <motion.div
                        key={dept.slug}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`bg-popover rounded-2xl overflow-hidden border border-border/50 cursor-pointer group transition-all duration-500 ${isExpanded ? "sm:col-span-2 lg:col-span-3" : ""}`}
                        onClick={() => !isExpanded && handleToggle(dept.slug)}
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
                                {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
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
                                  <Link to={`/medical-services/${dept.slug}`} className="inline-flex w-full justify-end items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors">
                                    {t("Read More")} <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
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
                                                setSubDoctorsByDept((p) => {
                                                  const next = { ...p };
                                                  delete next[dept.slug];
                                                  return next;
                                                });
                                                setSubDoctorsLoadingByDept((p) => {
                                                  const next = { ...p };
                                                  delete next[dept.slug];
                                                  return next;
                                                });
                                              } else {
                                                selectSubspecialityPill(dept, sub);
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
                              {subDoctorsLoading ? (
                                <div className="mt-auto flex gap-4 overflow-hidden py-2">
                                  <Skeleton className="h-48 w-[280px] rounded-2xl shrink-0" />
                                  <Skeleton className="h-48 w-[280px] rounded-2xl shrink-0 hidden md:block" />
                                </div>
                              ) : deptDoctors.length > 0 ? (
                                <div className="mt-auto">
                                  <p className="text-accent text-center text-xl tracking-[0.2em] uppercase font-body font-semibold mb-4">{lang === "ar" ? "أطباء القسم" : "Department Doctors"}</p>
                                  <div className="relative max-w-[576px] mx-auto lg:mt-6">
                                    {deptDoctors.length > 1 && (
                                      <>
                                        <button onClick={() => scrollDoctors("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"><ChevronLeft className="w-4 h-4" /></button>
                                        <button onClick={() => scrollDoctors("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"><ChevronRight className="w-4 h-4" /></button>
                                      </>
                                    )}
                                    <div className="overflow-hidden">
                                      <div ref={doctorScrollRef}
                                        className={`flex gap-20 md:gap-4 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory px-[20px] md:px-0 dept-doctor-carousel ${deptDoctors.length <= 2 ? 'lg:justify-center' : 'lg:justify-start'}`}
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                                        <style dangerouslySetInnerHTML={{ __html: `.dept-doctor-carousel{padding-left:calc((100vw - 280px)/2);padding-right:calc((100vw - 280px)/2)}@media(min-width:1024px){.dept-doctor-carousel{padding-left:0!important;padding-right:0!important}}` }} />
                                        {deptDoctors.map((doc) => (
                                          <Link to={`/doctors/${doc.id}`} key={doc.id} className="flex-shrink-0 w-[280px] snap-center md:snap-start">
                                            <motion.div whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }} className="bg-background rounded-2xl overflow-hidden border border-border/50 group/doc cursor-pointer h-full">
                                              <div className="bg-white h-48 flex items-center justify-center relative overflow-hidden">
                                                {doc.image ? <img src={doc.image} alt={lang === "ar" ? doc.nameAr : doc.name} className="w-full h-full object-cover object-top" /> : <div className="w-14 h-14 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30"><span className="text-lg font-serif text-primary-foreground">{doc.initials}</span></div>}
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center"><Stethoscope className="w-3 h-3 text-primary-foreground" /></div>
                                              </div>
                                              <div className="p-3">
                                                <p className="text-accent text-[9px] tracking-[0.2em] uppercase font-body mb-1">{lang === "ar" ? doc.specialtyAr : doc.specialty}</p>
                                                <h4 className="text-sm font-serif font-semibold text-foreground group-hover/doc:text-primary transition-colors">{lang === "ar" ? doc.nameAr : doc.name}</h4>
                                                <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-1">{lang === "ar" ? doc.titleAr : doc.title}</p>
                                                <p className="text-xs text-primary font-body mt-2 inline-flex items-center gap-1">{t("viewProfile")} <ArrowRight className="w-3 h-3" /></p>
                                              </div>
                                            </motion.div>
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  {dept.subs && dept.subs.length > 0 && selectedSubSlug && (
                                    <div className="mt-4 text-center">
                                      <Link to={`/medical-services/${dept.slug}/${selectedSubSlug}`} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors">
                                        {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-muted-foreground font-body text-xs italic mt-auto">{lang === "ar" ? "لم يتم تعيين أطباء لهذا القسم بعد" : "No doctors assigned to this department yet."}</p>
                              )}
                              <div className="mt-6 pt-4 border-t border-border/30" />
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
