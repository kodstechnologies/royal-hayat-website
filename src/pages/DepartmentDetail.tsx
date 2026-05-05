import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { departmentDetails } from "@/data/departmentDetails";
import { doctors as allDoctors } from "@/data/doctors";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowLeft, CheckCircle2, ChevronDown, Stethoscope, MessageCircle, Phone } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const DepartmentDoctors = ({ doctors, lang }: { doctors: typeof allDoctors; lang: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 768;
      const amount = isMobile ? (280 + 80) : (280 + 24);
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showArrows = doctors.length > (isMobile ? 1 : 4);

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-8">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {lang === "ar" ? "فريقنا" : "Our Team"}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              {lang === "ar" ? "أطباء القسم" : "Department Doctors"}
            </h2>
          </div>
        </ScrollAnimationWrapper>
        <div className="relative max-w-[1188px] mx-auto group/carousel">
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
                      alt={lang === "ar" ? doc.nameAr : doc.name}
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
                  <p className="font-serif text-sm text-foreground group-hover:text-primary transition-colors">{lang === "ar" ? doc.nameAr : doc.name}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-1">{lang === "ar" ? doc.titleAr : doc.title}</p>
                  <span className="inline-flex items-center gap-1 text-primary font-body text-xs tracking-wide mt-2">
                    {lang === "ar" ? "عرض الملف ←" : "View Profile →"}
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
            {lang === "ar" ? "اعرف المزيد" : "Read More"} <span className="ltr-icon">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
const DepartmentDetail = () => {
  const { slug, subSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromBookAppointment = Boolean(
    (location.state as { fromBookAppointment?: boolean } | null)?.fromBookAppointment
  );
  const { lang } = useLanguage();
  const [expandedSub, setExpandedSub] = useState<string | null>(subSlug || null);

  const dept = departmentDetails.find((d) => d.slug === slug);

  if (!dept) {
    return (
      <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-serif text-foreground mb-4">Department Not Found</h1>
          <Link to="/medical-services" className="text-accent hover:underline font-body text-sm">
            ← Back to Medical Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // If subSlug, find it
  const activeSub = subSlug ? dept.subDepartments?.find((s) => s.slug === subSlug) : null;
  const displayDept = activeSub || dept;

  // Map department detail names to doctor data department values
  const deptNameToDoctorDept: Record<string, string[]> = {
    "Obstetrics & Gynecology": ["Obstetrics & Gynecology"],
    "Reproductive Medicine & IVF": ["IVF"],
    "Pediatrics": ["Pediatric"],
    "Neonatal": ["Neonatal"],
    "Internal Medicine": ["Internal Medicine"],
    "General & Laparoscopic Surgery": ["General Surgery"],
    "Plastic Surgery": ["La Cosmetique"],
    "Dermatology": ["Dermatology"],
    "ENT (Ear, Nose & Throat)": ["ENT (Ear, Nose & Throat)"],
    "Family Medicine": ["Family Medicine"],
    "Dental Clinic": ["Dental"],
    "Anesthesia": ["Anesthesia"],
    "Center for Diagnostic Imaging": ["Radiology"],
    "Laboratory Services": ["Laboratory"],
    "Royale Hayat Pharmacy": [],
    "Clinical Pharmacy": ["Clinical Pharmacy"],
    "Clinical Nutrition & Dietetics": ["Nutricare"],
    "Physiotherapy": ["Physiotherapy"],
  };

  const matchingDepts = deptNameToDoctorDept[displayDept.name] || deptNameToDoctorDept[dept.name] || [];
  const deptDoctors = matchingDepts.length > 0
    ? allDoctors.filter((doc) => matchingDepts.includes(doc.department))
    : allDoctors.filter((doc) =>
      doc.department.toLowerCase().includes(dept.name.toLowerCase().split(" ")[0]) ||
      dept.name.toLowerCase().includes(doc.department.toLowerCase().split(" ")[0])
    );

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/medical-services" className="hover:text-accent transition-colors">Medical Services</Link>
            <ChevronRight className="w-3 h-3" />
            {activeSub ? (
              <>
                <Link to={`/medical-services/${dept.slug}`} className="hover:text-accent transition-colors">
                  {dept.name}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground font-bold">{activeSub.name}</span>
              </>
            ) : (
              <span className="text-foreground font-bold">{dept.name}</span>
            )}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-4xl">
              {fromBookAppointment && (
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="inline-flex items-center gap-2 text-accent font-body text-xs tracking-wide mb-4 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {lang === "ar" ? "العودة إلى حجز الموعد" : "Back to Book Appointment"}
                </button>
              )}
              {activeSub && (
                <button
                  onClick={() => navigate(`/medical-services/${dept.slug}`)}
                  className="inline-flex items-center gap-2 text-accent font-body text-xs tracking-wide mb-4 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to {dept.name}
                </button>
              )}
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                {activeSub ? dept.name : "Medical Services"}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
                {displayDept.name}
              </h1>
              <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line">
                {displayDept.intro}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Image/Video Placeholder */}
      {/* <section className="container mx-auto px-6 py-8">
        <div className="aspect-video bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-center">
          <p className="text-muted-foreground font-body text-sm">Department Image / Video</p>
        </div>
      </section> */}

      {/* Content Sections */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {displayDept.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8"
              >
                <h3 className="font-serif text-lg md:text-xl text-foreground mb-4">{section.title}</h3>
                {section.content && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                    {section.content}
                  </p>
                )}
                {section.items && (
                  <div className="space-y-2.5">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {section.subsections?.map((sub, k) => (
                  <div key={k} className="mt-6 pl-4 border-l-2 border-accent/20">
                    <h4 className="font-serif text-base text-foreground mb-3">{sub.title}</h4>
                    {sub.content && (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">{sub.content}</p>
                    )}
                    {sub.items && (
                      <div className="space-y-2">
                        {sub.items.map((item, l) => (
                          <div key={l} className="flex items-start gap-3">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="font-body text-sm text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image/Video Placeholder 2 */}
      {/* {displayDept.sections.length > 2 && (
        <section className="container mx-auto px-6 py-4">
          <div className="aspect-[4/3] md:aspect-video max-w-3xl mx-auto bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-center">
            <p className="text-muted-foreground font-body text-sm">Gallery / Video Content</p>
          </div>
        </section>
      )} */}

      {/* Sub-Departments */}
      {!activeSub && dept.subDepartments && dept.subDepartments.length > 0 && (
        <section className="py-12 bg-secondary/10">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-8">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">Explore</p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">Sub-Specialties</h2>
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
                      <span className="font-serif font-bold text-base text-foreground">{sub.name}</span>
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
                        <p className="font-body text-sm text-muted-foreground leading-relaxed mt-4 mb-4 whitespace-pre-line">
                          {sub.intro}
                        </p>
                        {sub.sections.map((section, j) => (
                          <div key={j} className="mb-4">
                            <h4 className="font-serif text-sm text-foreground mb-2">{section.title}</h4>
                            {section.content && (
                              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2 whitespace-pre-line">
                                {section.content}
                              </p>
                            )}
                            {section.items && (
                              <div className="space-y-1.5">
                                {section.items.map((item, k) => (
                                  <div key={k} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                                    <span className="font-body text-xs text-foreground">{item}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        <Link
                          to={`/medical-services/${dept.slug}/${sub.slug}`}
                          className="inline-flex items-center gap-2 text-accent font-body text-xs tracking-wide hover:underline mt-2"
                        >
                          View Full Details <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Doctors */}
      {deptDoctors.length > 0 && (
        <DepartmentDoctors doctors={deptDoctors} lang={lang} />
      )}

      {/* Home Health contact card */}
      {dept.slug === "home-health" && !activeSub && (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-popover border border-border/50 rounded-2xl p-6 md:p-8 text-center">
                <h3 className="font-serif text-xl text-foreground mb-6">
                  {lang === "ar" ? "استفسر الآن" : "Enquire Now"}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/96566320717"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {lang === "ar" ? "واتساب: 66320717 965+" : "WhatsApp: +965 66320717"}
                  </a>
                  <a
                    href="tel:+96525360500"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-body text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {lang === "ar" ? "اتصال: 25360500 965+" : "Call: +965 25360500"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default DepartmentDetail;
