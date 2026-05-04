import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Doctor } from "@/data/doctors";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDoctorDepartmentIds,
  getDoctorsByDepartment,
  mapApiDoctorRowToDoctor,
} from "@/api/doctors";
import { getAllDepartments } from "@/api/department";

type DepartmentDoctorGroup = {
  departmentId: string;
  department: string;
  departmentAr: string;
  doctors: Doctor[];
};

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
                  : (lang === "ar" ? "غير متاح للحجز الإلكتروني" : "Not Available for Online Booking")}
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

const departmentDescriptions: Record<string, { en: string; ar: string }> = {
  "Obstetrics & Gynecology": { en: "Complete maternity care from prenatal through postpartum recovery. Our team provides expert guidance for high-risk pregnancies, minimally invasive gynecological procedures, and comprehensive family planning services.", ar: "رعاية أمومة شاملة من ما قبل الولادة حتى التعافي بعد الولادة. يقدم فريقنا إرشادات متخصصة لحالات الحمل عالية الخطورة وإجراءات نسائية طفيفة التوغل وخدمات تنظيم الأسرة الشاملة." },
  "Internal Medicine": { en: "Comprehensive diagnosis and treatment of complex adult diseases. Our internists specialize in managing chronic conditions, preventive health screenings, and coordinating multidisciplinary care for optimal patient outcomes.", ar: "تشخيص وعلاج شامل لأمراض البالغين المعقدة. يتخصص أطباؤنا في إدارة الحالات المزمنة والفحوصات الوقائية وتنسيق الرعاية متعددة التخصصات لتحقيق أفضل النتائج." },
  "Dermatology": { en: "Expert care for all dermatological needs for adults and children. Our dermatologists offer advanced treatments for skin conditions, cosmetic procedures, and laser therapies using the latest diagnostic technologies.", ar: "رعاية متخصصة لجميع احتياجات الأمراض الجلدية للبالغين والأطفال. يقدم أطباء الجلدية لدينا علاجات متقدمة للأمراض الجلدية والإجراءات التجميلية والعلاج بالليزر باستخدام أحدث التقنيات." },
  "Family Medicine": { en: "Continuous, personalized care for individuals and families of all ages. Our family physicians build lasting relationships with patients, managing everything from routine check-ups to chronic disease management.", ar: "رعاية مستمرة ومخصصة للأفراد والعائلات من جميع الأعمار. يبني أطباء الأسرة لدينا علاقات دائمة مع المرضى ويديرون كل شيء من الفحوصات الروتينية إلى إدارة الأمراض المزمنة." },
  "Anesthesia": { en: "Top-tier anesthesia services ensuring patient safety and comfort. Our anesthesiologists provide pre-operative assessments, pain-free surgical experiences, and post-operative pain management using modern monitoring equipment.", ar: "خدمات تخدير عالية المستوى تضمن سلامة وراحة المريض. يقدم أطباء التخدير لدينا تقييمات قبل العملية وتجارب جراحية خالية من الألم وإدارة الألم بعد العملية باستخدام أحدث المعدات." },
  "Neonatal": { en: "Dedicated care for newborns requiring specialized medical attention. Our neonatal unit provides advanced life support, developmental care, and family-centered services for premature and critically ill infants.", ar: "رعاية مخصصة لحديثي الولادة الذين يحتاجون عناية طبية متخصصة. توفر وحدة حديثي الولادة لدينا دعم الحياة المتقدم والرعاية التنموية والخدمات المتمحورة حول الأسرة للأطفال الخدج والمرضى بشكل حرج." },
  "Clinical Pharmacy": { en: "Patient-focused pharmaceutical care ensuring safe and effective medication use. Our clinical pharmacists collaborate with medical teams to optimize drug therapy, prevent interactions, and provide medication counseling.", ar: "رعاية صيدلانية تركز على المريض وتضمن استخداماً آمناً وفعالاً للأدوية. يتعاون الصيادلة السريريون لدينا مع الفرق الطبية لتحسين العلاج الدوائي ومنع التفاعلات وتقديم الاستشارات الدوائية." },
  "General Surgery": { en: "Exceptional surgical care combining precision, safety, and rapid recovery. Our surgeons perform a wide range of minimally invasive and laparoscopic procedures including bariatric surgery, hernia repair, and oncological operations.", ar: "رعاية جراحية استثنائية تجمع بين الدقة والأمان والتعافي السريع. يجري جراحونا مجموعة واسعة من العمليات طفيفة التوغل بالمنظار بما في ذلك جراحة السمنة وإصلاح الفتق والعمليات الأورام." },
  "La Cosmetique": { en: "Advanced cosmetic and reconstructive surgery in a luxurious clinical setting. Our board-certified surgeons combine artistry with precision for body contouring, facial rejuvenation, rhinoplasty, and non-surgical aesthetic treatments.", ar: "جراحة تجميلية وترميمية متقدمة في بيئة سريرية فاخرة. يجمع جراحونا المعتمدون بين الفن والدقة لنحت الجسم وتجديد الوجه وتجميل الأنف والعلاجات التجميلية غير الجراحية." },
  "Pediatric": { en: "World-class pediatric care with warmth and a child-centered approach. From routine wellness visits to specialized treatments, our pediatricians ensure every child receives compassionate, evidence-based medical attention.", ar: "رعاية أطفال عالمية المستوى بدفء ونهج محوره الطفل. من زيارات العافية الروتينية إلى العلاجات المتخصصة، يضمن أطباء الأطفال لدينا حصول كل طفل على رعاية طبية رحيمة قائمة على الأدلة." },
  "Radiology": { en: "State-of-the-art diagnostic imaging services including MRI, CT, ultrasound, and interventional radiology. Our radiologists provide accurate, timely interpretations to support clinical decision-making across all departments.", ar: "خدمات تصوير تشخيصي حديثة تشمل الرنين المغناطيسي والتصوير المقطعي والموجات فوق الصوتية والأشعة التداخلية. يقدم أطباء الأشعة لدينا تفسيرات دقيقة وفي الوقت المناسب." },
  "Nutricare": { en: "Personalized clinical nutrition and dietetic services for all ages. Our registered dietitians provide medical nutrition therapy for chronic diseases, weight management, pre/post bariatric surgery diets, and pregnancy nutrition.", ar: "خدمات تغذية سريرية مخصصة لجميع الأعمار. يقدم أخصائيو التغذية المسجلون لدينا العلاج الغذائي الطبي للأمراض المزمنة وإدارة الوزن وأنظمة ما قبل وبعد جراحة السمنة وتغذية الحمل." },
  "Pharmacy": { en: "Full-service hospital pharmacy offering prescription medications, patient counseling, and medication safety. Our pharmacists ensure accurate dispensing and provide expert guidance on medication use and interactions.", ar: "صيدلية مستشفى متكاملة تقدم الأدوية الموصوفة واستشارات المرضى وسلامة الأدوية. يضمن صيادلتنا صرفاً دقيقاً ويقدمون إرشادات متخصصة حول استخدام الأدوية والتفاعلات." },
  "Dental": { en: "Exceptional dental care in a luxurious setting using advanced technology. From pediatric dentistry and endodontics to prosthodontics, cosmetic smile makeovers, and periodontal treatments.", ar: "رعاية أسنان استثنائية في بيئة فاخرة بتقنيات متقدمة. من طب أسنان الأطفال وعلاج الجذور إلى تركيبات الأسنان وتجميل الابتسامة وعلاج اللثة." },
  "IVF": { en: "Advanced fertility treatments blending expertise with cutting-edge technology. Our reproductive medicine team offers IVF, ICSI, genetic testing, surgical sperm retrieval, and embryo cryopreservation in a supportive environment.", ar: "علاجات خصوبة متقدمة تجمع بين الخبرة والتكنولوجيا الحديثة. يقدم فريق الطب التناسلي لدينا أطفال الأنابيب والحقن المجهري والفحص الجيني واستخراج الحيوانات المنوية وتجميد الأجنة." },
  "Laboratory": { en: "Comprehensive clinical laboratory and pathology services with rapid, accurate diagnostic testing. Our team includes histopathologists, microbiologists, and hematologists performing specialized analyses.", ar: "خدمات مختبر سريري وباثولوجي شاملة مع فحوصات تشخيصية سريعة ودقيقة. يضم فريقنا أخصائيي أنسجة وأحياء دقيقة وأمراض دم يجرون تحاليل متخصصة." },
  "ENT (Ear, Nose & Throat)": { en: "Expert care for conditions affecting the ear, nose, throat, head, and neck. Our ENT specialists provide surgical and non-surgical treatments for hearing disorders, sinus conditions, voice disorders, and head & neck tumors.", ar: "رعاية متخصصة لأمراض الأنف والأذن والحنجرة والرأس والرقبة. يقدم أخصائيونا علاجات جراحية وغير جراحية لاضطرابات السمع وأمراض الجيوب الأنفية واضطرابات الصوت وأورام الرأس والرقبة." },
};

const DepartmentRow = ({ department, departmentAr, docs }: { department: string; departmentAr: string; docs: Doctor[] }) => {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showArrows = docs.length > (isMobile ? 1 : 4);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const mobile = window.innerWidth < 768;
      const amount = mobile ? (280 + 80) : (280 + 24);
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  const deptDesc = departmentDescriptions[department];

  return (
    <div className="mb-12">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-serif text-foreground">
          {lang === "ar" ? departmentAr : department}
        </h2>
        {deptDesc && (
          <p className="text-muted-foreground font-body text-xs mt-1 line-clamp-2">
            {lang === "ar" ? deptDesc.ar : deptDesc.en}
          </p>
        )}
      </div>
      <div className="relative group/carousel">
        {showArrows && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="max-w-[1192px] mx-auto overflow-hidden">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-20 md:gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory px-[20px] md:px-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingLeft: "calc((100vw - 280px) / 2)",
              paddingRight: "calc((100vw - 280px) / 2)",
            }}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
              @media (min-width: 768px) {
                .snap-x { padding-left: 0 !important; padding-right: 0 !important; }
              }
            `}} />
            {docs.map((doc) => (
              <DoctorCard key={doc.id} doc={doc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">("loading");
  const [groups, setGroups] = useState<DepartmentDoctorGroup[]>([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadState("loading");
      try {
        const [deptIds, departmentRows] = await Promise.all([
          getDoctorDepartmentIds(),
          getAllDepartments({ limit: 100, page: 1, isActive: true }),
        ]);
        if (cancelled) return;

        const idToName = new Map<string, { en: string; ar: string }>();
        for (const d of departmentRows) {
          const id = String(d._id);
          const en = String(d.name ?? "");
          idToName.set(id, { en, ar: en });
        }

        const next: DepartmentDoctorGroup[] = [];
        for (const deptId of deptIds) {
          const rows = await getDoctorsByDepartment(deptId);
          if (cancelled) return;
          if (rows.length === 0) continue;
          const label = idToName.get(deptId) ?? { en: "Department", ar: "قسم" };
          const doctors = rows.map((row) => mapApiDoctorRowToDoctor(row, label.en, label.ar));
          next.push({
            departmentId: deptId,
            department: label.en,
            departmentAr: label.ar,
            doctors,
          });
        }

        setGroups(next);
        setLoadState("ok");
      } catch {
        if (!cancelled) setLoadState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allDoctors = useMemo(() => groups.flatMap((g) => g.doctors), [groups]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return allDoctors.filter((doc) => {
      const searchableFields = [
        doc.name,
        doc.nameAr,
        doc.specialty,
        doc.specialtyAr,
        doc.department,
        doc.departmentAr,
        doc.title,
        doc.titleAr,
        ...(doc.symptoms || []),
      ];

      return searchableFields.some((field) => (field || "").toLowerCase().includes(query));
    });
  }, [allDoctors, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const locale = lang === "ar" ? "ar" : "en";
  const stripTitlePrefix = (name: string) =>
    name
      .replace(/^(dr|prof|professor)\.?\s+/i, "")
      .trim();

  const sortedGroups = useMemo(() => {
    const ordered = [...groups].sort((a, b) =>
      (lang === "ar" ? a.departmentAr : a.department).localeCompare(
        lang === "ar" ? b.departmentAr : b.department,
        locale,
      ),
    );
    return ordered.map((g) => ({
      ...g,
      doctors: [...g.doctors].sort((a, b) =>
        (g.department === "Anesthesia"
          ? stripTitlePrefix(lang === "ar" ? a.nameAr : a.name)
          : (lang === "ar" ? a.nameAr : a.name)
        ).localeCompare(
          g.department === "Anesthesia"
            ? stripTitlePrefix(lang === "ar" ? b.nameAr : b.name)
            : (lang === "ar" ? b.nameAr : b.name),
          locale,
        ),
      ),
    }));
  }, [groups, lang, locale]);

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("ourTeam")}</p>
            <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-4">{t("meetOurDoctors")}</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto text-sm md:text-base">
              {lang === "ar" ? "ابحث عن الطبيب المناسب حسب الأعراض أو التخصص" : "Find the right doctor by symptom or specialty"}
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-14">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن الأعراض، الطبيب، القسم..." : "Search symptoms, doctor, department..."}
                className="pl-12 pr-4 py-6 text-base rounded-2xl border-border/60 bg-popover shadow-sm focus:ring-primary"
              />
            </div>
          </div>

          {loadState === "loading" && (
            <div className="flex flex-col items-center justify-center min-h-[280px] gap-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-48 w-full max-w-3xl" />
              <p className="text-muted-foreground font-body text-sm">
                {lang === "ar" ? "جاري تحميل الأطباء…" : "Loading doctors…"}
              </p>
            </div>
          )}

          {loadState === "error" && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center max-w-xl mx-auto">
              <p className="font-serif text-lg text-foreground mb-2">
                {lang === "ar" ? "تعذر تحميل قائمة الأطباء" : "Could not load doctors"}
              </p>
              <p className="text-muted-foreground font-body text-sm">
                {lang === "ar" ? "تحقق من الاتصال بالخادم وحاول مرة أخرى." : "Check your connection to the server and try again."}
              </p>
            </div>
          )}

          {loadState === "ok" && (
            <>
              {isSearching ? (
                <div>
                  <h3 className="text-lg font-serif text-foreground mb-6">
                    {lang === "ar" ? `نتائج البحث (${searchResults.length})` : `Search Results (${searchResults.length})`}
                  </h3>
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {searchResults.map((doc) => (
                        <div key={doc.id} className="min-w-0 max-w-none">
                          <DoctorCard doc={doc} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-12 font-body">
                      {lang === "ar" ? "لم يتم العثور على نتائج. حاول بكلمات مختلفة." : "No results found. Try different keywords."}
                    </p>
                  )}
                </div>
              ) : sortedGroups.length > 0 ? (
                sortedGroups.map((g) => (
                  <DepartmentRow
                    key={g.departmentId}
                    department={g.department}
                    departmentAr={g.departmentAr}
                    docs={g.doctors}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-12 font-body">
                  {lang === "ar" ? "لا يوجد أطباء مسجلون في الأقسام حاليًا." : "No doctors are listed under any department yet."}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <ChatButton />
      <ScrollToTop />
    </div>
  );
};

export default Doctors;
