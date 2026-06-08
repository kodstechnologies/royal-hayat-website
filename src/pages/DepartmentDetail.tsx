import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import {
  loadDepartmentDetails,
  type DepartmentDetail as DepartmentDetailData,
  type DepartmentDetailSection,
} from "@/data/loadDepartmentDetails";
import { departments as staticDepartments, MAIN_CATEGORIES, ROYALE_HAYAT_PHARMACY_DOCTOR_IDS, CLINICAL_PHARMACY_DOCTOR_IDS, PAIN_MANAGEMENT_DOCTOR_IDS, type MainCategory } from "@/data/departments";
import { loadDoctors, type Doctor } from "@/data/loadDoctors";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Stethoscope, MessageCircle, Phone, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveDepartmentBySlug } from "@/utils/resolveDepartmentSlug";
import { normalizeSubSlug, resolveSubDepartment } from "@/utils/departmentSubSlug";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
const pickDeptText = (lang: string, en: string, ar?: string) => (lang === "ar" && ar ? ar : en);

const getDeptSubheading = (lang: string, mainCategory: MainCategory | undefined, medicalServicesLabel: string) => {
  if (lang !== "ar") {
    return medicalServicesLabel;
  }
  if (mainCategory === "Clinical Support Service") {
    const category = MAIN_CATEGORIES.find((item) => item.key === mainCategory);
    return category?.labelAr ?? medicalServicesLabel;
  }
  return medicalServicesLabel;
};

const sectionHasArabic = (section: DepartmentDetailSection) =>
  Boolean(section.titleAr || section.contentAr || section.itemsAr?.length);

const getDeptColonIndex = (text: string) => {
  const candidates = [text.indexOf(":"), text.indexOf("؛")].filter((index) => index !== -1);
  return candidates.length ? Math.min(...candidates) : -1;
};

/** Bold label before the first colon or Arabic semicolon (e.g. "Preconception Planning:"). */
const renderDeptColonText = (text: string) => {
  const colonIndex = getDeptColonIndex(text);
  if (colonIndex === -1) {
    return text;
  }
  const label = text.slice(0, colonIndex + 1);
  const rest = text.slice(colonIndex + 1);
  return (
    <>
      <strong className="font-bold text-foreground">{label}</strong>
      {rest}
    </>
  );
};

const renderDeptHeading = (text: string) => {
  if (getDeptColonIndex(text) === -1) {
    return <span className="font-bold">{text}</span>;
  }
  return renderDeptColonText(text);
};

const renderDeptListItem = renderDeptColonText;

/** Paragraphs separated by blank lines; wrap text in **markers** for bold emphasis. */
const renderDeptContent = (content: string) =>
  content.split("\n\n").map((paragraph, i) => (
    <span key={i}>
      {i > 0 && (
        <>
          <br />
          <br />
        </>
      )}
      {paragraph.split(/(\*\*[^*]+\*\*)/g).map((segment, j) =>
        segment.startsWith("**") && segment.endsWith("**") ? (
          <strong key={j} className="font-semibold text-foreground">
            {segment.slice(2, -2)}
          </strong>
        ) : (
          segment
        )
      )}
    </span>
  ));
const isAlSafwaDepartment = (slug: string, name: string) =>
  slug.includes("al-safwa") || name.toLowerCase().includes("safwa");
const DepartmentDoctors = memo(({ doctors, lang }: { doctors: Doctor[]; lang: string }) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 768;
      const amount = isMobile ? (280 + 80) : (280 + 24);
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
      isPausedRef.current = true;
      setTimeout(() => { isPausedRef.current = false; }, 5000);
    }
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (doctors.length <= 1) return;
    autoSlideRef.current = setInterval(() => {
      if (isPausedRef.current || !scrollRef.current) return;
      const el = scrollRef.current;
      const isMob = window.innerWidth < 768;
      const cardWidth = isMob ? (280 + 80) : (280 + 24);
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [doctors.length]);
  const showArrows = doctors.length > (isMobile ? 1 : 4);
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-8">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {lang === "ar" ? "فريقنا الطبي" : "Our Medical Team"}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              {lang === "ar" ? "أطباء القسم" : "Department Doctors"}
            </h2>
          </div>
        </ScrollAnimationWrapper>
        <div
          className="relative max-w-[1188px] mx-auto group/carousel"
          dir="ltr"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          {showArrows && (
            <>
              <button onClick={() => scroll("left")}
                className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll("right")}
                className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            dir="ltr"
            className={`flex gap-20 md:gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory px-[20px] md:px-0 detail-doctor-carousel ${doctors.length <= 2 ? 'md:justify-center' : 'md:justify-start'}`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
              .detail-doctor-carousel {
                padding-left: calc((100vw - 280px) / 2);
                padding-right: calc((100vw - 280px) / 2);
              }
              @media (min-width: 768px) {
                .detail-doctor-carousel {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                }
              }
            `}} />
            {doctors.slice(0, 12).map((doc) => (
              <Link
                key={doc.id}
                to={`/doctors/${doc.id}`}
                className="w-[280px] md:w-[280px] bg-popover border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group flex-shrink-0 snap-center md:snap-start"
              >
                <div className="bg-white h-56 flex items-center justify-center relative">
                  {doc.image ? (
                    <img
                      src={doc.image}
                      alt={getDoctorDisplayName(doc, lang)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center border-2 border-popover/30">
                      <span className="text-xl font-serif text-primary-foreground">{doc.initials}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-popover/20 backdrop-blur-sm flex items-center justify-center">
                    <Stethoscope className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-accent text-[10px] tracking-[0.2em] uppercase font-body mb-1">{lang === "ar" ? doc.specialtyAr : doc.specialty}</p>
                  <p className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">{getDoctorDisplayName(doc, lang)}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-1">{lang === "ar" ? doc.titleAr : doc.title}</p>
                  <span className="inline-flex items-center gap-1 text-primary font-body text-xs tracking-wide mt-2">
                    {t("viewProfile")} <ArrowRight className={`w-3 h-3 shrink-0 ${lang === "ar" ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 max-w-5xl mx-auto">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-full hover:bg-primary/90 transition-colors"
          >
            {t("learnMore")} <span className="ltr-icon">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
});
DepartmentDoctors.displayName = "DepartmentDoctors";
const DepartmentDetail = () => {
  const { slug, subSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as {
    fromBookAppointment?: boolean;
    fromSpecializedCare?: boolean;
    fromDepartments?: boolean;
    returnPath?: string;
    restoreDeptOpenIndex?: number;
    restoreSelectedSubByDept?: Record<number, string>;
    restoreScrollY?: number;
    restoreExpandedIndex?: number | null;
    restoreSelectedSubByService?: Record<string, string>;
  } | null) ?? {};
  const fromBookAppointment = Boolean(navState.fromBookAppointment);
  const fromSpecializedCare = Boolean(navState.fromSpecializedCare);
  const fromDepartments = Boolean(navState.fromDepartments);
  const departmentsListRestoreState = fromDepartments
    ? {
        restoreDeptOpenIndex: navState.restoreDeptOpenIndex,
        restoreSelectedSubByDept: navState.restoreSelectedSubByDept,
        restoreScrollY: navState.restoreScrollY,
      }
    : undefined;
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [expandedSub, setExpandedSub] = useState<string | null>(subSlug || null);
  const [dept, setDept] = useState<DepartmentDetailData | null | undefined>(undefined);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  useEffect(() => {
    let cancelled = false;
    void loadDepartmentDetails().then((details) => {
      if (cancelled) return;
      setDept(resolveDepartmentBySlug(slug, details) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);
  useEffect(() => {
    let cancelled = false;
    void loadDoctors().then((list) => {
      if (!cancelled) setAllDoctors(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const goBackToSpecializedCare = () => {
    navigate(navState.returnPath || "/", {
      state: {
        restoreExpandedIndex: navState.restoreExpandedIndex,
        restoreSelectedSubByService: navState.restoreSelectedSubByService,
        restoreScrollY: navState.restoreScrollY,
      },
    });
  };
  const goBackToDepartmentsList = () => {
    navigate(navState.returnPath || "/medical-services", {
      state: departmentsListRestoreState,
    });
  };
  const goBackToDepartment = () => {
    if (fromDepartments) {
      goBackToDepartmentsList();
      return;
    }
    if (fromSpecializedCare) {
      goBackToSpecializedCare();
      return;
    }
    navigate(`/medical-services/${slug}`);
  };
  const goToAlSafwaProgram = () => {
    if (fromDepartments) {
      navigate("/al-safwa", {
        state: {
          fromDepartments: true,
          returnPath: navState.returnPath,
          restoreDeptOpenIndex: navState.restoreDeptOpenIndex,
          restoreSelectedSubByDept: navState.restoreSelectedSubByDept,
          restoreScrollY: navState.restoreScrollY,
        },
      });
      return;
    }
    if (fromSpecializedCare) {
      navigate("/al-safwa", {
        state: {
          fromSpecializedCare: true,
          returnPath: navState.returnPath,
          restoreExpandedIndex: navState.restoreExpandedIndex,
          restoreSelectedSubByService: navState.restoreSelectedSubByService,
          restoreScrollY: navState.restoreScrollY,
        },
      });
      return;
    }
    navigate("/al-safwa");
  };
  if (dept === undefined) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
          <span className="sr-only">Loading department...</span>
        </div>
        <Footer />
      </div>
    );
  }
  const alSafwaDept = dept ? isAlSafwaDepartment(dept.slug, dept.name) : false;
  if (!dept) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-serif text-foreground mb-4">Department Not Found</h1>
          <Link to="/medical-services" className="text-accent hover:underline font-body text-sm">
            â† Back to Medical Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  const resolvedSubSlug = subSlug && dept ? normalizeSubSlug(dept.slug, subSlug) : subSlug;
  const activeSub = resolvedSubSlug ? resolveSubDepartment(dept, resolvedSubSlug) : null;
  const displayDept = activeSub || dept;
  const staticDept = staticDepartments.find((d) => d.slug === dept.slug);
  const deptImage = staticDept?.img || "";
  const deptNameToDoctorDept: Record<string, string[]> = {
    "Obstetrics & Gynecology": ["Obstetrics & Gynecology"],
    "Reproductive Medicine & IVF": ["IVF"],
    "Pediatrics": ["Pediatric"],
    "Neonatal": ["Neonatal"],
    "Internal Medicine": ["Internal Medicine"],
    "General & Laparoscopic Surgery": ["General Surgery"],
    "Plastic Surgery & Cosmetology": ["La Cosmetique"],
    "Dermatology": ["Dermatology"],
    "ENT (Ear, Nose & Throat)": ["ENT (Ear, Nose & Throat)"],
    "Family Medicine": ["Family Medicine"],
    "Dental Clinic": ["Dental"],
    "Anesthesia": ["Anesthesia"],
    "Intensive Care": ["Anesthesia"],
    "Center for Diagnostic Imaging": ["Radiology"],
    "Laboratory Services": ["Laboratory"],
    "Royale Hayat Pharmacy": ["Pharmacy"],
    "Clinical Pharmacy": ["Clinical Pharmacy"],
    "Clinical Nutrition & Dietetics": ["Nutricare"],
    "Physiotherapy": ["Physiotherapy"],
  };
  const matchingDepts = deptNameToDoctorDept[displayDept.name] || deptNameToDoctorDept[dept.name] || [];
  const baseDeptDoctors = dept.name === "Royale Hayat Pharmacy"
    ? allDoctors.filter((doc) => (ROYALE_HAYAT_PHARMACY_DOCTOR_IDS as readonly string[]).includes(doc.id))
    : dept.name === "Clinical Pharmacy"
      ? allDoctors.filter((doc) => (CLINICAL_PHARMACY_DOCTOR_IDS as readonly string[]).includes(doc.id))
      : dept.name === "Pain Management"
        ? allDoctors.filter((doc) => (PAIN_MANAGEMENT_DOCTOR_IDS as readonly string[]).includes(doc.id))
      : matchingDepts.length > 0
      ? allDoctors.filter((doc) => matchingDepts.includes(doc.department))
      : allDoctors.filter((doc) =>
        doc.department.toLowerCase().includes(dept.name.toLowerCase().split(" ")[0]) ||
        dept.name.toLowerCase().includes(doc.department.toLowerCase().split(" ")[0])
      );
  const deptDoctors = (() => {
    if (!resolvedSubSlug) {
      return baseDeptDoctors.sort((a, b) =>
        (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en")
      );
    }
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
    const mapKey = Object.keys(subSpecialtyDoctorMap).find(
      (k) => resolvedSubSlug.includes(k) || k.includes(resolvedSubSlug)
    );
    if (mapKey && subSpecialtyDoctorMap[mapKey].length > 0) {
      const keywords = subSpecialtyDoctorMap[mapKey];
      const filtered = baseDeptDoctors.filter((doc) =>
        keywords.some((kw) => doc.id.toLowerCase().includes(kw) || doc.name.toLowerCase().includes(kw))
      );
      if (filtered.length > 0) {
        return [...filtered].sort((a, b) =>
          (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en")
        );
      }
    }
    if (activeSub) {
      const subKeywords = activeSub.name
        .toLowerCase()
        .split(/[\s&,/()+]+/)
        .filter((w) => w.length > 3);
      const filtered = baseDeptDoctors.filter((doc) => {
        const haystack = `${doc.title} ${doc.specialty} ${doc.titleAr} ${doc.id}`.toLowerCase();
        return subKeywords.some((kw) => haystack.includes(kw));
      });
      if (filtered.length > 0) {
        return [...filtered].sort((a, b) =>
          (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en")
        );
      }
    }
    return baseDeptDoctors.sort((a, b) =>
      (lang === "ar" ? a.nameAr : a.name).localeCompare(lang === "ar" ? b.nameAr : b.name, lang === "ar" ? "ar" : "en")
    );
  })();
  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              to={fromDepartments ? navState.returnPath || "/medical-services" : "/medical-services"}
              state={departmentsListRestoreState}
              className="hover:text-accent transition-colors font-bold"
            >
              {t("medicalServices")}
            </Link>
            <ChevronRight className="w-3 h-3" />
            {activeSub ? (
              <>
                <Link
                  to={`/medical-services/${dept.slug}`}
                  state={navState}
                  className="hover:text-accent transition-colors"
                >
                  {pickDeptText(lang, dept.name, dept.nameAr)}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-bold">
                  {pickDeptText(lang, activeSub.name, activeSub.nameAr)}
                </span>
              </>
            ) : (
              <span className="text-foreground font-bold">{pickDeptText(lang, dept.name, dept.nameAr)}</span>
            )}
          </nav>
        </div>
      </div>
      {}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-6">
          {fromDepartments && (
            <button
              type="button"
              onClick={goBackToDepartmentsList}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isAr ? "العودة" : "Go Back"}
            </button>
          )}
          <ScrollAnimationWrapper>
            <div className="max-w-4xl">
              {fromSpecializedCare && !activeSub && !fromDepartments && (
                <button
                  onClick={goBackToSpecializedCare}
                  className="inline-flex items-center gap-2 text-accent font-body text-xs tracking-wide mb-4 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {isAr ? "العودة" : "Go Back"}
                </button>
              )}
              {fromBookAppointment && (
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="inline-flex items-center gap-2 text-accent font-body text-xs tracking-wide mb-4 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {lang === "ar" ? "العودة إلى حجز الموعد" : "Back to Book Appointment"}
                </button>
              )}
              {activeSub && !fromDepartments && (
                <button
                  onClick={goBackToDepartment}
                  className="inline-flex items-center gap-2 text-accent font-body text-xs tracking-wide mb-4 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {isAr ? `العودة إلى ${dept.nameAr}` : `Back to ${dept.name}`}
                </button>
              )}
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body font-bold mb-3">
                {activeSub
                  ? pickDeptText(lang, dept.name, dept.nameAr)
                  : getDeptSubheading(lang, staticDept?.mainCategory, t("medicalServices"))}
              </p>
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 ${
                  isAr ? "dept-detail-rtl" : ""
                }`}
              >
                {pickDeptText(lang, displayDept.name, displayDept.nameAr)}
              </h1>
              <p
                className={`font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line text-justify ${
                  isAr ? "dept-detail-rtl" : ""
                }`}
              >
                {pickDeptText(lang, displayDept.intro, displayDept.introAr)}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
      {}
      {}
      {!activeSub && (
        <section className="container mx-auto px-6 py-8 flex justify-center">
          <div
            role={alSafwaDept ? "link" : undefined}
            tabIndex={alSafwaDept ? 0 : undefined}
            onClick={alSafwaDept ? goToAlSafwaProgram : undefined}
            onKeyDown={
              alSafwaDept
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goToAlSafwaProgram();
                    }
                  }
                : undefined
            }
            className={`aspect-video w-full max-w-4xl bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-center overflow-hidden ${
              alSafwaDept
                ? "cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                : ""
            }`}
          >
            {deptImage ? (
              <img
                src={deptImage}
                alt={displayDept.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-muted-foreground font-body text-sm">
                Image / Video Content
              </p>
            )}
          </div>
        </section>
      )}
      {}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {displayDept.sections
              .filter((section) => lang !== "ar" || sectionHasArabic(section))
              .map((section: DepartmentDetailSection, i) => {
              const sectionTitle = pickDeptText(lang, section.title, section.titleAr);
              const sectionContent = section.content
                ? pickDeptText(lang, section.content, section.contentAr)
                : undefined;
              const sectionItems =
                lang === "ar" && section.itemsAr?.length ? section.itemsAr : section.items;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  role={alSafwaDept ? "link" : undefined}
                  tabIndex={alSafwaDept ? 0 : undefined}
                  onClick={alSafwaDept ? goToAlSafwaProgram : undefined}
                  onKeyDown={
                    alSafwaDept
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            goToAlSafwaProgram();
                          }
                        }
                      : undefined
                  }
                  className={`bg-popover border border-border/50 rounded-2xl p-6 md:p-8 ${
                    alSafwaDept
                      ? "cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                      : ""
                  }`}
                >
                  <h3
                    className={`font-serif text-lg md:text-xl text-foreground mb-4 ${
                      isAr ? "dept-detail-rtl" : ""
                    }`}
                  >
                    {renderDeptHeading(sectionTitle)}
                  </h3>
                  {sectionContent && (
                    <p
                      className={`font-body text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line text-justify ${
                        isAr ? "dept-detail-rtl" : ""
                      }`}
                    >
                      {renderDeptContent(sectionContent)}
                    </p>
                  )}
                  {sectionItems && (
                    <div className="space-y-2.5">
                      {sectionItems.map((item, j) => (
                        <div key={j} className={`flex items-start gap-3 ${isAr ? "dept-detail-rtl" : ""}`}>
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="font-body text-sm text-foreground leading-relaxed text-justify">
                            {renderDeptListItem(item)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.subsections?.map((sub, k) => (
                    <div key={k} className={`mt-6 pl-4 border-l-2 border-accent/20 ${isAr ? "dept-detail-rtl" : ""}`}>
                      <h4 className="font-serif text-base text-foreground mb-3">
                        {renderDeptHeading(pickDeptText(lang, sub.title, sub.titleAr))}
                      </h4>
                      {sub.content && (
                        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3 text-justify">
                          {renderDeptContent(pickDeptText(lang, sub.content, sub.contentAr))}
                        </p>
                      )}
                      {(lang === "ar" && sub.itemsAr?.length ? sub.itemsAr : sub.items) && (
                        <div className="space-y-2">
                          {(lang === "ar" && sub.itemsAr?.length ? sub.itemsAr : sub.items)!.map((item, l) => (
                            <div key={l} className="flex items-start gap-3">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="font-body text-sm text-foreground text-justify">
                                {renderDeptListItem(item)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {}
      {
}
      {}
      {!activeSub && dept.subDepartments && dept.subDepartments.length > 0 && (
        <section className="py-12 bg-secondary/10">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-8">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("exploreSubSpecialties")}</p>
                <h2 className={`text-2xl md:text-3xl font-serif text-foreground ${isAr ? "dept-detail-rtl" : ""}`}>
                  {t("subSpecialties")}
                </h2>
              </div>
            </ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto space-y-3">
              {dept.subDepartments.map((sub, i) => (
                <motion.div
                  key={sub.slug}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="bg-popover border border-border/50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedSub(expandedSub === sub.slug ? null : sub.slug)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                    >
                      <span className={`font-serif font-bold text-base text-foreground ${isAr ? "dept-detail-rtl" : ""}`}>
                        {pickDeptText(lang, sub.name, sub.nameAr)}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSub === sub.slug ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {expandedSub === sub.slug && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="px-6 pb-5 border-t border-border/30"
                      >
                        <p
                          className={`font-body text-sm text-muted-foreground leading-relaxed mt-4 mb-4 whitespace-pre-line text-justify ${
                            isAr ? "dept-detail-rtl" : ""
                          }`}
                        >
                          {pickDeptText(lang, sub.intro, sub.introAr)}
                        </p>
                        {sub.sections
                          .filter((section) => lang !== "ar" || sectionHasArabic(section))
                          .map((section, j) => (
                          <div key={j} className={`mb-4 ${isAr ? "dept-detail-rtl" : ""}`}>
                            <h4 className="font-serif text-foreground mb-2">
                              {renderDeptHeading(pickDeptText(lang, section.title, section.titleAr))}
                            </h4>
                            {section.content && (
                              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2 whitespace-pre-line text-justify">
                                {renderDeptContent(pickDeptText(lang, section.content, section.contentAr))}
                              </p>
                            )}
                            {(lang === "ar" && section.itemsAr?.length ? section.itemsAr : section.items) && (
                              <div className="space-y-1.5">
                                {(lang === "ar" && section.itemsAr?.length ? section.itemsAr : section.items)!.map(
                                  (item, k) => (
                                    <div key={k} className="flex items-start gap-2">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                                      <span className="font-body text-xs text-foreground text-justify">
                                        {renderDeptListItem(item)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {
}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {}
      {deptDoctors.length > 0 && (
        <DepartmentDoctors doctors={deptDoctors} lang={lang} />
      )}
      {}
      {dept.slug === "home-health" && !activeSub && (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8 text-center">
                <h3 className="font-serif text-xl text-foreground mb-6">
                  {lang === "ar" ? "للاستفسار" : "Enquire Now"}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/96566320717"
                    className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-xs hover:bg-primary/90 transition-colors ${lang === "ar" ? "tracking-normal normal-case" : "tracking-[0.15em] uppercase"}`}
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    {lang === "ar" ? (
                      <>
                        واتساب:{" "}
                        <span className="inline-block [unicode-bidi:bidi-override] [direction:rtl] tabular-nums">
                          {"+965 66320717".split("").reverse().join("")}
                        </span>
                      </>
                    ) : (
                      <>WhatsApp: <span className="inline-block [direction:ltr] [unicode-bidi:isolate]">+965 66320717</span></>
                    )}
                  </a>
                  <a
                    href="tel:+96525360500"
                    className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-xs hover:bg-primary/90 transition-colors ${lang === "ar" ? "tracking-normal normal-case" : "tracking-[0.15em] uppercase"}`}
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    {lang === "ar" ? (
                      <>
                        الهاتف:{" "}
                        <span className="inline-block [unicode-bidi:bidi-override] [direction:rtl] tabular-nums">
                          {"+965 25360500".split("").reverse().join("")}
                        </span>
                      </>
                    ) : (
                      <>Call: <span className="inline-block [direction:ltr] [unicode-bidi:isolate]">+965 25360500</span></>
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <style>{`
        .dept-detail-rtl {
          direction: rtl;
          text-align: right;
        }
      `}</style>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default DepartmentDetail;
