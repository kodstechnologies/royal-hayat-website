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
};

const DepartmentsSection = ({
  apiCatalog,
  apiGroupedCatalog,
  apiCatalogLoading = false,
  disableStaticFallback = false,
  catalogFetchFailed = false,
  showDepartmentDoctorsOnCards = false,
  fetchDoctorsBySubspeciality = getDoctorsBySubspeciality,
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
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
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

  const sortedFilteredDepts = [...filteredDepts].sort((a, b) =>
    (lang === "ar" ? a.nameAr : a.name).localeCompare(
      lang === "ar" ? b.nameAr : b.name,
      lang === "ar" ? "ar" : "en"
    )
  );

  const filteredGroups = useMemo(() => {
    if (!useGroupedLayout || !apiGroupedCatalog) return null;
    const q = searchQuery.toLowerCase().trim();
    return apiGroupedCatalog
      .map((g) => ({
        ...g,
        departments: g.departments.filter((d) => {
          if (!q) return true;
          const withEmb = d as DepartmentWithEmbeddedDoctors;
          const docMatch =
            withEmb.embeddedDoctors?.some(
              (doc) =>
                doc.name.toLowerCase().includes(q) ||
                doc.nameAr.toLowerCase().includes(q) ||
                doc.specialty.toLowerCase().includes(q) ||
                doc.specialtyAr.toLowerCase().includes(q),
            ) ?? false;
          return (
            d.name.toLowerCase().includes(q) ||
            d.nameAr.toLowerCase().includes(q) ||
            d.desc.toLowerCase().includes(q) ||
            d.descAr.toLowerCase().includes(q) ||
            g.name.toLowerCase().includes(q) ||
            docMatch
          );
        }),
      }))
      .filter((g) => {
        if (!q) return true;
        return g.departments.length > 0;
      });
  }, [apiGroupedCatalog, searchQuery, useGroupedLayout]);

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
    const slug = selectedDept.slug;
    if (subDoctorsLoadingByDept[slug]) {
      return [];
    }

    const selectedSubSlug = selectedSubByDept[slug];
    const selectedSub =
      selectedDept.subs?.find(
        (s) => getSubSlugForDepartment(slug, s.name) === selectedSubSlug,
      ) ?? null;
    const filteringByApiSubspeciality = Boolean(selectedSub?.subspecialityId);

    if (filteringByApiSubspeciality) {
      const fromApi = subDoctorsByDept[slug];
      if (fromApi !== undefined) {
        return [...fromApi].sort((a, b) =>
          (lang === "ar" ? a.nameAr : a.name).localeCompare(
            lang === "ar" ? b.nameAr : b.name,
            lang === "ar" ? "ar" : "en",
          ),
        );
      }
      return [];
    }

    if (slug in subDoctorsByDept) {
      return [...subDoctorsByDept[slug]].sort((a, b) =>
        (lang === "ar" ? a.nameAr : a.name).localeCompare(
          lang === "ar" ? b.nameAr : b.name,
          lang === "ar" ? "ar" : "en",
        ),
      );
    }
    const departmentDoctors = deptDoctorsMap[slug] || [];
    return [...departmentDoctors].sort((a, b) =>
      (lang === "ar" ? a.nameAr : a.name).localeCompare(
        lang === "ar" ? b.nameAr : b.name,
        lang === "ar" ? "ar" : "en",
      ),
    );
  }, [
    deptDoctorsMap,
    selectedDept,
    lang,
    subDoctorsByDept,
    subDoctorsLoadingByDept,
    selectedSubByDept,
  ]);

  const renderDepartmentCard = (dept: Department) => {
    const isExpanded = openSlug === dept.slug;
    const selectedSubSlug = selectedSubByDept[dept.slug];
    const selectedSubDetail =
      selectedSubSlug && dept.subs?.length
        ? dept.subs.find((s) => getSubSlugForDepartment(dept.slug, s.name) === selectedSubSlug)
        : undefined;
    return (
      <motion.div
        key={dept.slug}
        layout
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`bg-popover rounded-2xl overflow-hidden border border-border/50 cursor-pointer group transition-all duration-500 ${isExpanded ? "sm:col-span-2 lg:col-span-3" : ""
          }`}
        onClick={() => !isExpanded && handleToggle(dept.slug)}
      >
        {!isExpanded ? (
          /* Collapsed: Image card */
          <>
            <div className="relative h-52 md:h-60 overflow-hidden">
              <img
                src={dept.img}
                alt={lang === "ar" ? dept.nameAr : dept.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-popover/70 to-transparent" />
            </div>
            <div className="p-4 md:p-5">
              <h3 className="text-sm md:text-base font-serif text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {lang === "ar" ? dept.nameAr : dept.name}
              </h3>
              <p className="text-muted-foreground font-body text-xs leading-relaxed mb-3 line-clamp-2">
                {lang === "ar" ? dept.descAr : dept.desc}
              </p>
              {dept.subs && dept.subs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {dept.subs.slice(0, 3).map((sub, subIdx) => (
                    <button
                      key={`${dept.slug}-${sub.name}-${sub.subspecialityId ?? subIdx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isExpanded) handleToggle(dept.slug);
                        selectSubspecialityPill(dept, sub);
                      }}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-body border border-border/50 bg-secondary/50 text-foreground hover:border-primary/40 hover:bg-secondary transition-colors text-left"
                    >
                      {lang === "ar" ? sub.nameAr : sub.name}
                    </button>
                  ))}
                  {dept.subs.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-body border border-border/50 bg-secondary/50 text-muted-foreground">
                      +{dept.subs.length - 3}
                    </span>
                  )}
                </div>
              )}
              <span className="inline-flex items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors">
                {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
              </span>
              {showDepartmentDoctorsOnCards && useGroupedLayout ? (
                <div
                  className="mt-4 pt-3 border-t border-border/40"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="presentation"
                >
                  <p className="text-accent text-[9px] tracking-[0.2em] uppercase font-body mb-2">
                    {lang === "ar" ? "أطباء القسم" : "Department doctors"}
                  </p>
                  {(() => {
                    const emb = (dept as DepartmentWithEmbeddedDoctors).embeddedDoctors;
                    if (!emb || emb.length === 0) {
                      return (
                        <p className="text-[10px] text-muted-foreground font-body italic">
                          {lang === "ar"
                            ? "لا يوجد أطباء معيّنون بعد."
                            : "No doctors assigned yet."}
                        </p>
                      );
                    }
                    return (
                      <div
                        className="flex gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {emb.map((doc) => (
                          <Link
                            key={doc.id}
                            to={`/doctors/${doc.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-background/90 px-2 py-1.5 max-w-[200px] hover:border-primary/40 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0 border border-border/40">
                              {doc.image ? (
                                <img
                                  src={doc.image}
                                  alt={lang === "ar" ? doc.nameAr : doc.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-serif text-primary">
                                  {doc.initials}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 text-left">
                              <p className="text-[11px] font-serif text-foreground leading-tight line-clamp-2">
                                {lang === "ar" ? doc.nameAr : doc.name}
                              </p>
                              <p className="text-[9px] text-muted-foreground font-body line-clamp-1 mt-0.5">
                                {lang === "ar" ? doc.specialtyAr : doc.specialty}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          /* Expanded Panel */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Image + Info */}
            <div className="lg:w-2/5 relative">
              <div className="relative h-72 lg:h-full min-h-[380px] overflow-hidden">
                <img
                  src={dept.img}
                  alt={lang === "ar" ? dept.nameAr : dept.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-popover via-popover/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 max-h-[78%] flex flex-col justify-end">
                  <div className="min-h-0 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
                    <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2 shrink-0">
                      {lang === "ar" ? dept.nameAr : dept.name}
                    </h3>
                    {dept.departmentContentBlocks && dept.departmentContentBlocks.length > 0 ? (
                      <div className="space-y-3 mb-3 text-foreground/90">
                        {dept.departmentContentBlocks.map((block, bi) => (
                          <div key={`dcb-${bi}`}>
                            {block.subHeading?.trim() ? (
                              <p className="text-accent text-[10px] tracking-[0.2em] uppercase font-body mb-1.5">
                                {block.subHeading.trim()}
                              </p>
                            ) : null}
                            {block.explanations.length > 0 ? (
                              <ul className="list-disc ps-4 space-y-1 text-xs font-body leading-relaxed">
                                {block.explanations.map((line, i) => (
                                  <li key={`dcb-${bi}-ex-${i}`}>{line}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {lang === "ar" ? dept.descAr : dept.desc}
                    </p>
                  </div>
                  <Link
                    to={`/medical-services/${dept.slug}`}
                    className="inline-flex w-full justify-end items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors shrink-0 mt-3 pt-2 border-t border-border/20"
                  >
                    {t("Read More")} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Sub-specialties + Doctor Cards */}
            <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col">
              {/* Header with close */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  {dept.subs && dept.subs.length > 0 && (
                    <>
                      <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-2">
                        {lang === "ar" ? "التخصصات الفرعية" : "Sub-specialties"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dept.subs.map((sub, subIdx) => (
                          <button
                            key={`${sub.name}-${sub.subspecialityId ?? subIdx}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectSubspecialityPill(dept, sub);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${selectedSubSlug === getSubSlugForDepartment(dept.slug, sub.name)
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
                </div>
                <button
                  type="button"
                  onClick={() => setOpenSlug(null)}
                  className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0 ml-4"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {selectedSubSlug && selectedSubDetail && (
                <div className="mb-6 rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">
                    {lang === "ar" ? selectedSubDetail.nameAr : selectedSubDetail.name}
                  </p>
                  {selectedSubDetail.description?.trim() ? (
                    <p className="text-sm text-muted-foreground font-body leading-relaxed whitespace-pre-line">
                      {selectedSubDetail.description.trim()}
                    </p>
                  ) : null}
                  {selectedSubDetail.customBlocks?.map((block, bi) => (
                    <div key={`cb-${bi}`} className="space-y-1.5">
                      {block.subHeading?.trim() ? (
                        <p className="text-accent text-[10px] tracking-[0.2em] uppercase font-body">
                          {block.subHeading.trim()}
                        </p>
                      ) : null}
                      {block.explanations.length > 0 ? (
                        <ul className="list-disc ps-4 space-y-1 text-sm text-foreground/90 font-body">
                          {block.explanations.map((line, li) => (
                            <li key={`${bi}-ex-${li}`}>{line}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border/40">
                    <Link
                      to={`/medical-services/${dept.slug}/${selectedSubSlug}`}
                      className="inline-flex items-center gap-2 text-primary font-body text-xs font-medium tracking-wide hover:underline"
                    >
                      {lang === "ar" ? "عرض التفاصيل الكاملة" : "View full details"}{" "}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Doctor Cards — matching DoctorsSection style */}
              {subDoctorsLoadingByDept[dept.slug] ? (
                <div className="mt-auto py-8 text-center">
                  <p className="text-muted-foreground font-body text-sm">
                    {lang === "ar" ? "جاري تحميل الأطباء…" : "Loading doctors…"}
                  </p>
                </div>
              ) : deptDoctors.length > 0 ? (
                <div className="mt-auto">
                  <p className="text-accent text-center text-xl tracking-[0.2em] uppercase font-body font-semibold mb-4">
                    {lang === "ar" ? "أطباء القسم" : "Department Doctors"}
                  </p>
                  <div className="relative max-w-[576px] mx-auto lg:mt-6">
                    {deptDoctors.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => scrollDoctors("left")}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollDoctors("right")}
                          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <div className="overflow-hidden">
                      <div
                        ref={doctorScrollRef}
                        className={`flex gap-20 md:gap-4 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory px-[20px] md:px-0 dept-doctor-carousel ${deptDoctors.length <= 2 ? 'lg:justify-center' : 'lg:justify-start'}`}
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <style dangerouslySetInnerHTML={{
                          __html: `
                        .dept-doctor-carousel {
                          padding-left: calc((100vw - 280px) / 2);
                          padding-right: calc((100vw - 280px) / 2);
                        }
                        @media (min-width: 1024px) {
                          .dept-doctor-carousel { 
                            padding-left: 0 !important; 
                            padding-right: 0 !important; 
                          }
                        }
                      `}} />
                        {deptDoctors.map((doc) => (
                          <Link to={`/doctors/${doc.id}`} key={doc.id} className="flex-shrink-0 w-[280px] snap-center md:snap-start">
                            <motion.div
                              whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(74,20,35,0.12)" }}
                              className="bg-background rounded-2xl overflow-hidden border border-border/50 group/doc cursor-pointer h-full"
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
                                <p className="text-accent text-[9px] tracking-[0.2em] uppercase font-body mb-1">
                                  {lang === "ar" ? doc.specialtyAr : doc.specialty}
                                </p>
                                <h4 className="text-sm font-serif font-semibold text-foreground group-hover/doc:text-primary transition-colors">
                                  {lang === "ar" ? doc.nameAr : doc.name}
                                </h4>
                                <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-1">
                                  {lang === "ar" ? doc.titleAr : doc.title}
                                </p>
                                <p className="text-xs text-primary font-body mt-2 inline-flex items-center gap-1">
                                  {t("viewProfile")} <ArrowRight className="w-3 h-3" />
                                </p>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  {dept.subs && dept.subs.length > 0 && selectedSubSlug && (
                    <div className="mt-4 text-center">
                      <Link
                        to={`/medical-services/${dept.slug}/${selectedSubSlug}`}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                      >
                        {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground font-body text-xs italic mt-auto">
                  {(() => {
                    const subForEmpty =
                      dept.subs?.find(
                        (s) => getSubSlugForDepartment(dept.slug, s.name) === selectedSubSlug,
                      ) ?? null;
                    const subspecialityContext =
                      Boolean(subForEmpty?.subspecialityId) || dept.slug in subDoctorsByDept;
                    return subspecialityContext
                      ? lang === "ar"
                        ? "لا يوجد أطباء لهذا التخصص الفرعي."
                        : "No doctors found for this subspeciality."
                      : lang === "ar"
                        ? "لم يتم تعيين أطباء لهذا القسم بعد"
                        : "No doctors assigned to this department yet.";
                  })()}
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-border/30 flex flex-wrap items-center justify-end gap-3">
                <Link
                  to={`/medical-services/${dept.slug}`}
                  className="inline-flex items-center gap-2 text-muted-foreground font-body text-xs tracking-wide hover:text-primary transition-colors"
                >
                  {lang === "ar" ? "صفحة القسم" : "Department page"} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {selectedSubSlug ? (
                  <Link
                    to={`/medical-services/${dept.slug}/${selectedSubSlug}`}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                  >
                    {lang === "ar" ? "عرض التفاصيل الكاملة" : "View full details"}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  if (apiCatalogLoading) {
    return (
      <section className="py-16 md:py-24 bg-background" ref={sectionRef} id="departments">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center min-h-[320px] gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full max-w-2xl" />
          <p className="text-muted-foreground font-body text-sm mt-4">
            {lang === "ar" ? "جاري تحميل الأقسام…" : "Loading departments…"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background" ref={sectionRef} id="departments">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("ourSpecialties")}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">{t("medicalDepartments")}</h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto text-sm md:text-base">
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
              placeholder={lang === "ar" ? "ابحث عن الأعراض، الطبيب، القسم..." : "Search departments..."}
              className="pl-12 pr-4 py-6 text-base rounded-2xl border-border/60 bg-popover shadow-sm focus:ring-primary"
            />
          </div>
        </div>

        {catalogFetchFailed ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
            <p className="font-serif text-lg text-foreground mb-2">
              {lang === "ar" ? "تعذر تحميل الأقسام" : "Could not load departments"}
            </p>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
              {lang === "ar"
                ? "تحقق من الاتصال أو حاول مرة أخرى لاحقًا."
                : "Check your connection or try again later. This page only shows live data from the server."}
            </p>
          </div>
        ) : useGroupedLayout && filteredGroups !== null ? (
          filteredGroups.length > 0 ? (
            <div className="space-y-14 md:space-y-20">
              {filteredGroups.map((group) => (
                <section
                  key={group._id}
                  id={`medical-category-${group._id}`}
                  className="scroll-mt-28"
                  aria-labelledby={`category-heading-${group._id}`}
                >
                  <h3
                    id={`category-heading-${group._id}`}
                    className="text-2xl md:text-3xl lg:text-[2rem] font-serif font-semibold tracking-tight text-foreground mb-6 md:mb-8 text-center md:text-start pb-4 border-b-2 border-primary/15"
                  >
                    {group.name}
                  </h3>
                  {group.departments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      {group.departments.map((dept) => renderDepartmentCard(dept))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground font-body text-sm py-2">
                      {lang === "ar"
                        ? "لا توجد أقسام مرتبطة بهذه الفئة بعد."
                        : "No departments are linked to this category yet."}
                    </p>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-20">
              <p className="text-muted-foreground font-body">
                {searchQuery.trim()
                  ? lang === "ar"
                    ? "لم يتم العثور على أقسام تطابق بحثك."
                    : "No departments found matching your search."
                  : lang === "ar"
                    ? "لا توجد أقسام منشورة في الكتالوج حاليًا."
                    : "No departments are published in the catalog yet."}
              </p>
            </div>
          )
        ) : disableStaticFallback ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">
              {lang === "ar" ? "جاري تهيئة الكتالوج…" : "Preparing catalog…"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {sortedFilteredDepts.length > 0 ? (
              sortedFilteredDepts.map((dept) => renderDepartmentCard(dept))
            ) : (
              <div className="sm:col-span-2 lg:col-span-3 text-center py-20">
                <p className="text-muted-foreground font-body">
                  {lang === "ar" ? "لم يتم العثور على أقسام تطابق بحثك." : "No departments found matching your search."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DepartmentsSection;
