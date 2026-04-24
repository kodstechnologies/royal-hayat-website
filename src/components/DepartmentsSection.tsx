import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, X, Stethoscope, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { doctors as allDoctors } from "@/data/doctors";
import { departments, deptDoctorAliases, type Department } from "@/data/departments";
import { departmentDetails } from "@/data/departmentDetails";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";


const DepartmentsSection = () => {
  const getDeptDoctors = (deptName: string) => {
    const aliases = deptDoctorAliases[deptName] || [deptName];
    return allDoctors.filter((doc) => aliases.some(a => doc.department.includes(a) || doc.specialty.includes(a)));
  };
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedSubByDept, setSelectedSubByDept] = useState<Record<number, string>>({});
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

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const getSubSlug = (deptSlug: string, subName: string) => {
    const detail = departmentDetails.find((d) => d.slug === deptSlug);
    const matched = detail?.subDepartments?.find((s) => s.name.toLowerCase() === subName.toLowerCase());
    return matched?.slug ?? slugify(subName);
  };

  const selectedDept = openIndex !== null ? departments[openIndex] : null;
  const deptDoctors = selectedDept ? getDeptDoctors(selectedDept.name) : [];

  // Reorder: expanded first, rest after
  const reorderedDepts = openIndex !== null
    ? [departments[openIndex], ...departments.filter((_, i) => i !== openIndex)]
    : departments;

  const getOriginalIndex = (dept: Department) =>
    departments.findIndex((d) => d.name === dept.name);

  const numStr = (i: number) => String(i + 1).padStart(2, "0");

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {sortedFilteredDepts.length > 0 ? (
            (sortedFilteredDepts).map((dept) => {
              const origIdx = getOriginalIndex(dept);
              const isExpanded = openIndex === origIdx;
              const selectedSubSlug = selectedSubByDept[origIdx];

              return (
                <motion.div
                  key={dept.name}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`bg-popover rounded-2xl overflow-hidden border border-border/50 cursor-pointer group transition-all duration-500 ${isExpanded ? "sm:col-span-2 lg:col-span-3" : ""
                    }`}
                  onClick={() => !isExpanded && handleToggle(origIdx)}
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
                        <span className="inline-flex items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors">
                          {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
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
                          <div className="absolute bottom-0 left-0 right-0 p-6">

                            <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2">
                              {lang === "ar" ? dept.nameAr : dept.name}
                            </h3>
                            <p className="text-muted-foreground font-body text-sm leading-relaxed">
                              {lang === "ar" ? dept.descAr : dept.desc}
                            </p>
                            <Link to={`/medical-services/${dept.slug}`} className="inline-flex w-full justify-end items-center gap-1.5 text-primary font-body text-xs tracking-wide hover:text-accent transition-colors
                            
                         ">
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
                                  {dept.subs.map((sub) => (
                                    <button
                                      key={sub.name}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const subSlug = getSubSlug(dept.slug, sub.name);
                                        setSelectedSubByDept((prev) => ({ ...prev, [origIdx]: subSlug }));
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                                        selectedSubSlug === getSubSlug(dept.slug, sub.name)
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
                            {(!dept.subs || dept.subs.length === 0) && (
                              <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-lg">
                                {lang === "ar" ? dept.descAr : dept.desc}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => setOpenIndex(null)}
                            className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0 ml-4"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>

                        {/* Doctor Cards — matching DoctorsSection style */}
                        {deptDoctors.length > 0 ? (
                          <div className="mt-auto">
                            <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-4">
                              {lang === "ar" ? "أطباء القسم" : "Department Doctors"}
                            </p>
                            <div className="relative max-w-[576px] mx-auto lg:mt-6">
                              {deptDoctors.length > 1 && (
                                <>
                                  <button
                                    onClick={() => scrollDoctors("left")}
                                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
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
                            {lang === "ar" ? "لم يتم تعيين أطباء لهذا القسم بعد" : "No doctors assigned to this department yet."}
                          </p>
                        )}

                        {/* View Full Details Link */}
                        <div className="mt-6 pt-4 border-t border-border/30">
                          {/* <Link
                            to={`/medical-services/${dept.slug}`}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                          >
                            {t("learnMore")} <ArrowRight className="w-3.5 h-3.5" />
                          </Link> */}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-20">
              <p className="text-muted-foreground font-body">
                {lang === "ar" ? "لم يتم العثور على أقسام تطابق بحثك." : "No departments found matching your search."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
