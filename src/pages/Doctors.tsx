import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { Search, ChevronLeft, ChevronRight, Stethoscope, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchAllDoctorsByDepartment } from "@/api/doctors";
import { fetchAllDepartmentsPages } from "@/api/department";
import type { Doctor } from "@/types/doctor";
import { MAIN_CATEGORIES, type MainCategory } from "@/types/department";
import { deptDoctorAliases, deptDoctorAliasNameAr, shouldShowDoctorBookingUI } from "@/data/departments";
import { resolveDoctorTaglines } from "@/data/doctorTaglines";
import { mapApiDepartmentsToDisplay } from "@/utils/mapApiDepartment";
import { Input } from "@/components/ui/input";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
import { sortDoctorsAlphabetically, sortDoctorsInDepartment } from "@/utils/sortDoctorsInDepartment";
import {
  compareDoctorsPageDepartments,
} from "@/utils/doctorDepartmentOrder";
import { getDoctorCarouselScrollState, scrollDoctorCarousel, scrollDoctorCarouselToDoctor, scrollDoctorCarouselToStart, syncDoctorCarouselIndex } from "@/utils/doctorCarousel";
import { filterDoctorsBySearch } from "@/utils/doctorSearch";
import {
  buildDoctorsProfileNavState,
  clearDoctorsPageRestore,
  resolveDoctorsPageRestore,
  saveDoctorsPageRestore,
} from "@/utils/doctorsPageRestore";


const DoctorCard = memo(({ doc, onDoctorClick }: { doc: Doctor; onDoctorClick: (doc: Doctor) => void }) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const displayName = getDoctorDisplayName(doc, lang);
  return (
    <Link
      to={`/doctors/${doc.id}`}
      data-doctor-carousel-card
      data-doctor-id={doc.id}
      dir={isAr ? "rtl" : "ltr"}
      className="relative z-0 block w-[280px] min-h-[430px] flex-shrink-0 snap-center hover:z-10 md:snap-start"
      onClick={(e) => {
        e.preventDefault();
        onDoctorClick(doc);
      }}
    >
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.12)" }}
        className="bg-popover rounded-2xl border border-border/50 group cursor-pointer w-full h-full flex flex-col transition-all duration-300"
      >
        <div className="bg-white h-64 flex items-center justify-center relative overflow-hidden shrink-0 rounded-t-2xl">
          {doc.image ? (
            <img src={doc.image} alt={displayName} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30">
              <span className="text-2xl font-serif text-primary-foreground">{doc.initials}</span>
            </div>
          )}
          <div
            className={`absolute top-3 w-7 h-7 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center ${
              isAr ? "left-3" : "right-3"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow text-start items-start">
          <p
            className={`text-accent text-[10px] tracking-[0.2em] font-body mb-1.5 w-full ${
              isAr ? "" : "uppercase"
            }`}
          >
            {isAr ? doc.departmentAr || doc.specialtyAr : doc.department || doc.specialty}
          </p>
          <h3 className="text-[1.2rem] font-serif font-bold text-foreground mb-1 w-full">{displayName}</h3>
          <p className="text-muted-foreground font-body text-xs mb-3 w-full">
            {isAr ? doc.titleAr : doc.title}
          </p>
          {shouldShowDoctorBookingUI(doc) && (
            <div className="flex items-center gap-1.5 mb-2 w-full text-green-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="font-body text-[10px]">
                {doc.availableOnline !== false
                  ? (isAr ? "متاح للحجز اونلاين" : "Book Online")
                  : (isAr ? "طلب موعد" : "Appointment Request")}
              </span>
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 text-primary font-body text-xs tracking-wide group-hover:text-accent transition-colors">
            {isAr ? "عرض الملف الشخصي ←" : "View Profile →"}
          </span>
        </div>
      </motion.div>
    </Link>
  );
});
DoctorCard.displayName = "DoctorCard";

type DeptMeta = {
  nameAr: string;
  doctorTagline: string;
  doctorTaglineArabic: string;
  mainCategory?: MainCategory;
  order: number;
};

type DoctorsRestoreState = {
  fromDoctors?: boolean;
  restoreScrollY?: number;
  restoreDoctorId?: string;
  restoreSearchQuery?: string;
};

const DepartmentRow = memo(({
  department,
  departmentAr,
  docs,
  deptMeta,
  restoreDoctorId,
  onDoctorClick,
}: {
  department: string;
  departmentAr: string;
  docs: Doctor[];
  deptMeta?: DeptMeta;
  restoreDoctorId?: string | null;
  onDoctorClick: (doc: Doctor) => void;
}) => {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitializedCarouselRef = useRef(false);
  const highlightDoctorIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (restoreDoctorId && docs.some((doc) => doc.id === restoreDoctorId)) {
      highlightDoctorIdRef.current = restoreDoctorId;
      hasInitializedCarouselRef.current = false;
      return;
    }
    if (!restoreDoctorId) {
      highlightDoctorIdRef.current = null;
    }
  }, [restoreDoctorId, docs]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncDoctorCarouselIndex(el);
    const { canScrollLeft: left, canScrollRight: right } = getDoctorCarouselScrollState(el);
    setCanScrollLeft(left);
    setCanScrollRight(right);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scheduleUpdate = () => {
      window.requestAnimationFrame(updateScrollState);
    };

    const scrollToInitialPosition = () => {
      const doctorId = highlightDoctorIdRef.current;
      if (doctorId && docs.some((doc) => doc.id === doctorId)) {
        scrollDoctorCarouselToDoctor(el, doctorId);
        hasInitializedCarouselRef.current = true;
        return;
      }
      if (!hasInitializedCarouselRef.current) {
        scrollDoctorCarouselToStart(el);
        hasInitializedCarouselRef.current = true;
      }
    };

    scheduleUpdate();
    requestAnimationFrame(() => {
      scrollToInitialPosition();
      scheduleUpdate();
    });
    const delayedChecks = [
      window.setTimeout(() => {
        scrollToInitialPosition();
        scheduleUpdate();
      }, 150),
      window.setTimeout(() => {
        scrollToInitialPosition();
        scheduleUpdate();
      }, 500),
      window.setTimeout(() => {
        scrollToInitialPosition();
        scheduleUpdate();
      }, 900),
      window.setTimeout(scheduleUpdate, 1200),
    ];

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));

    el.addEventListener("scroll", updateScrollState, { passive: true });
    el.addEventListener("load", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      delayedChecks.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      el.removeEventListener("scroll", updateScrollState);
      el.removeEventListener("load", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [docs, lang, updateScrollState, restoreDoctorId]);

  const scroll = useCallback(
    (dir: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;

      void scrollDoctorCarousel(el, dir).finally(() => {
        updateScrollState();
        window.requestAnimationFrame(updateScrollState);
      });
    },
    [updateScrollState],
  );
  const staticTaglines = resolveDoctorTaglines(department);
  const doctorTaglineText = {
    en: deptMeta?.doctorTagline || staticTaglines?.en || "",
    ar: deptMeta?.doctorTaglineArabic || staticTaglines?.ar || "",
  };
  const doctorTagline =
    doctorTaglineText.en || doctorTaglineText.ar ? doctorTaglineText : undefined;
  const isAr = lang === "ar";
  return (
    <div className="mb-14">
      <div className="max-w-[1192px] mx-auto mb-6">
        <h3 className={`text-2xl font-serif font-bold text-foreground mb-3 ${isAr ? "text-right" : ""}`}>
          {isAr ? (departmentAr || deptMeta?.nameAr || department) : department}
        </h3>
        {doctorTagline && (
          <div className="bg-popover border border-border/50 rounded-2xl p-4 md:p-5 shadow-sm">
            <p
              dir={lang === "ar" ? "rtl" : "ltr"}
              className={`text-muted-foreground font-body text-base leading-relaxed ${lang === "ar" ? "text-right" : ""}`}
            >
              {lang === "ar" ? doctorTagline.ar : doctorTagline.en}
            </p>
          </div>
        )}
      </div>
      <div className="relative isolate" dir="ltr">
        <button
          type="button"
          aria-label={lang === "ar" ? "التمرير لليسار" : "Scroll left"}
          aria-hidden={!canScrollLeft}
          tabIndex={canScrollLeft ? 0 : -1}
          onClick={() => scroll("left")}
          className={`absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-opacity shadow-md ltr-icon touch-manipulation ${
            !canScrollLeft
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto hover:bg-primary hover:text-primary-foreground hover:border-primary"
          }`}
        >
          <ChevronLeft className="w-5 h-5 pointer-events-none" />
        </button>
        <button
          type="button"
          aria-label={lang === "ar" ? "التمرير لليمين" : "Scroll right"}
          aria-hidden={!canScrollRight}
          tabIndex={canScrollRight ? 0 : -1}
          onClick={() => scroll("right")}
          className={`absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground transition-opacity shadow-md ltr-icon touch-manipulation ${
            !canScrollRight
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto hover:bg-primary hover:text-primary-foreground hover:border-primary"
          }`}
        >
          <ChevronRight className="w-5 h-5 pointer-events-none" />
        </button>
        <div className="relative z-0 max-w-[1192px] mx-auto overflow-hidden">
          <div
            key={lang}
            ref={scrollRef}
            dir={isAr ? "rtl" : "ltr"}
            className="doctors-carousel-track flex w-full items-stretch gap-4 overflow-x-auto pb-8 snap-x snap-mandatory max-md:scroll-px-[calc(50%-140px)] max-md:px-[calc(50%-140px)] md:gap-6 md:px-0 md:scroll-px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
          >
            {docs.map((doc) => (
              <DoctorCard key={doc.id} doc={doc} onDoctorClick={onDoctorClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
DepartmentRow.displayName = "DepartmentRow";
const Doctors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorCatalog, setDoctorCatalog] = useState<Doctor[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [deptMetaByName, setDeptMetaByName] = useState<Record<string, DeptMeta>>({});
  const [restoreDoctorId, setRestoreDoctorId] = useState<string | null>(null);
  const restoreScrollYRef = useRef<number | null>(null);
  const restoreHandledRef = useRef(false);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const restored = resolveDoctorsPageRestore(location.state as DoctorsRestoreState | null);
    if (!restored?.doctorId) return;

    restoreScrollYRef.current = restored.scrollY;
    setRestoreDoctorId(restored.doctorId);
    restoreHandledRef.current = false;
    if (restored.searchQuery) {
      setSearchQuery(restored.searchQuery);
    }
    clearDoctorsPageRestore();
  }, [location.key, location.state]);

  const openDoctorProfile = useCallback(
    (doc: Doctor) => {
      const navState = buildDoctorsProfileNavState(doc, searchQuery);
      saveDoctorsPageRestore(navState);
      navigate(`/doctors/${doc.id}`, { state: navState });
    },
    [navigate, searchQuery],
  );

  useEffect(() => {
    if (!restoreDoctorId || catalogLoading || restoreHandledRef.current) return;

    const doctorId = restoreDoctorId;
    const scrollY = restoreScrollYRef.current ?? 0;

    const scrollToSavedDoctor = () => {
      const card = document.querySelector<HTMLElement>(`[data-doctor-id="${doctorId}"]`);
      if (card) {
        card.scrollIntoView({ block: "center", behavior: "auto" });
        return;
      }
      if (scrollY > 0) {
        window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
      }
    };

    scrollToSavedDoctor();
    const raf = window.requestAnimationFrame(scrollToSavedDoctor);
    const timers = [150, 500, 900].map((delay) =>
      window.setTimeout(scrollToSavedDoctor, delay),
    );
    const finalizeTimer = window.setTimeout(() => {
      restoreHandledRef.current = true;
    }, 950);

    return () => {
      window.cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(finalizeTimer);
    };
  }, [restoreDoctorId, catalogLoading]);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [apiList, deptRows] = await Promise.all([
          fetchAllDoctorsByDepartment(),
          fetchAllDepartmentsPages({ isActive: true }),
        ]);
        if (cancelled) return;
        setDoctorCatalog(apiList);
        const mapped = mapApiDepartmentsToDisplay(deptRows);
        const metaByName: Record<string, DeptMeta> = {};
        mapped.forEach((dept, index) => {
          const row = deptRows.find(
            (item) => String(item.name ?? "").trim() === dept.name,
          );
          const apiDoctorTagline = String(row?.doctorTagline ?? "").trim();
          const apiDoctorTaglineArabic = String(row?.doctorTaglineArabic ?? "").trim();
          const staticTaglines = resolveDoctorTaglines(dept.name);
          const entry: DeptMeta = {
            nameAr: dept.nameAr,
            doctorTagline: apiDoctorTagline || staticTaglines?.en || "",
            doctorTaglineArabic: apiDoctorTaglineArabic || staticTaglines?.ar || "",
            mainCategory: dept.mainCategory,
            order: dept.order ?? index,
          };
          metaByName[dept.name] = entry;
          const aliases = deptDoctorAliases[dept.name] ?? [];
          for (const alias of aliases) {
            if (metaByName[alias]) continue;
            const aliasTaglines = resolveDoctorTaglines(alias);
            metaByName[alias] = {
              ...entry,
              nameAr:
                alias === dept.name
                  ? entry.nameAr
                  : deptDoctorAliasNameAr[alias] ?? "",
              doctorTagline: aliasTaglines?.en || entry.doctorTagline,
              doctorTaglineArabic: aliasTaglines?.ar || entry.doctorTaglineArabic,
            };
          }
        });
        setDeptMetaByName(metaByName);
      } catch {
        if (!cancelled) {
          setDoctorCatalog([]);
          setCatalogError("Failed to load doctors.");
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const deptToMainCategory = useMemo<Record<string, MainCategory>>(() => {
    const map: Record<string, MainCategory> = {};
    Object.entries(deptMetaByName).forEach(([name, meta]) => {
      if (meta.mainCategory) map[name] = meta.mainCategory;
    });
    return map;
  }, [deptMetaByName]);
  const getDeptMainCategory = useCallback((dept: string): MainCategory => {
    if (deptToMainCategory[dept]) return deptToMainCategory[dept];
    return "Clinical Speciality";
  }, [deptToMainCategory]);
  const grouped = useMemo<Record<string, Doctor[]>>(() => {
    return doctorCatalog.reduce<Record<string, Doctor[]>>((acc, doctor) => {
      const key = doctor.department || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(doctor);
      return acc;
    }, {});
  }, [doctorCatalog]);
  const allDoctors = useMemo(() => Object.values(grouped).flat(), [grouped]);
  const searchResults = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];
    return sortDoctorsAlphabetically(filterDoctorsBySearch(allDoctors, query), "en");
  }, [allDoctors, searchQuery]);
  const isSearching = searchQuery.trim().length > 0;
  const sortedGroupedEntries = useMemo(() => {
    const sortDocsWithinDept = (dept: string, docs: Doctor[]) =>
      sortDoctorsInDepartment(docs, dept, "en");
    return Object.entries(grouped)
      .filter(([, docs]) => Array.isArray(docs) && docs.length > 0)
      .map(([dept, docs]) => [dept, sortDocsWithinDept(dept, docs)] as const)
      .sort(([deptA], [deptB]) => compareDoctorsPageDepartments(deptA, deptB, "en"));
  }, [grouped]);
  const groupedByMainCategory = useMemo(() => {
    const result: Record<MainCategory, typeof sortedGroupedEntries> = {
      "Clinical Speciality": [],
      "Clinical Support Service": [],
      "Home Care Service": [],
    };
    sortedGroupedEntries.forEach((entry) => {
      const cat = getDeptMainCategory(entry[0]);
      result[cat].push(entry);
    });
    return result;
  }, [sortedGroupedEntries, getDeptMainCategory]);
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {catalogError && !catalogLoading && (
            <p className="text-center text-muted-foreground font-body mb-8">{catalogError}</p>
          )}
          {catalogLoading && (
            <div className="flex min-h-[30vh] items-center justify-center text-muted-foreground mb-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
              <span className="sr-only">Loading doctors...</span>
            </div>
          )}
          <div className="text-center mb-12">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">
              {lang === "ar" ? "فريقنا الطبي" : "Our Medical Team"}
            </p>
            <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
              {lang === "ar" ? "تعرف على أطبائنا" : "Meet Our Doctors"}
            </h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto text-sm md:text-base">
              {lang === "ar"
                ? "ابحث عن الطبيب المناسب حسب الأعراض أو التخصص الطبي الذي تحتاجه"
                : "Find the right doctor by symptom or specialty"}
            </p>
          </div>
          <div className="max-w-2xl mx-auto mb-14">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchDoctorDepartment")}
                className="pl-12 pr-4 py-6 text-base rounded-2xl border-border/60 bg-popover shadow-sm focus:ring-primary"
              />
            </div>
          </div>
          {isSearching ? (
            <div>
              <h3 className="text-lg font-serif text-foreground mb-6">
                {lang === "ar" ? `نتائج البحث (${searchResults.length})` : `Search Results (${searchResults.length})`}
              </h3>
              {searchResults.length > 0 ? (
                <div
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {searchResults.map((doc) => (
                    <div key={doc.id} className="min-w-0 max-w-none">
                      <DoctorCard doc={doc} onDoctorClick={openDoctorProfile} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12 font-body">
                  {lang === "ar" ? "لم يتم العثور على نتائج. حاول بكلمات مختلفة." : "No results found. Try different keywords."}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-16">
              {MAIN_CATEGORIES.map((cat) => {
                const entries = groupedByMainCategory[cat.key];
                if (!entries || entries.length === 0) return null;
                return (
                  <div key={cat.key}>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="h-px flex-1 bg-border/50" />
                      <h2 className="text-base md:text-lg font-body font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-accent whitespace-nowrap px-1">
                        {lang === "ar" ? cat.labelAr : cat.label}
                      </h2>
                      <div className="h-px flex-1 bg-border/50" />
                    </div>
                    {entries.map(([dept, docs]) => (
                      <DepartmentRow
                        key={dept}
                        department={dept}
                        departmentAr={docs[0]?.departmentAr || dept}
                        docs={docs}
                        deptMeta={deptMetaByName[dept]}
                        restoreDoctorId={
                          restoreDoctorId && docs.some((doc) => doc.id === restoreDoctorId)
                            ? restoreDoctorId
                            : null
                        }
                        onDoctorClick={openDoctorProfile}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default Doctors;
