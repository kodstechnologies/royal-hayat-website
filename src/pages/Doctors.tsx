import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { doctors, type Doctor } from "@/data/doctors";
import { Input } from "@/components/ui/input";

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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show arrows if more than 4 on desktop, or more than 1 on mobile
  const showArrows = docs.length > (isMobile ? 1 : 4);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth < 768;
      // On mobile, scroll by card width (280) + large gap (80)
      // On desktop, scroll card width (280) + gap (24)
      const amount = isMobile ? (280 + 80) : (280 + 24);
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  const deptDesc = departmentDescriptions[department];

  return (
    <div className="mb-14">
      <div className="max-w-[1192px] mx-auto mb-6">
        <h3 className="text-2xl font-serif text-foreground mb-3">
          {lang === "ar" ? departmentAr : department}
        </h3>
        {deptDesc && (
          <div className="bg-popover border border-border/50 rounded-2xl p-4 md:p-5 shadow-sm">
            <p className="text-muted-foreground font-body text-base leading-relaxed">
              {lang === "ar" ? deptDesc.ar : deptDesc.en}
            </p>
          </div>
        )}
      </div>
      <div className="relative group/carousel">
        {showArrows && (
          <>
            <button onClick={() => scroll("left")}
              className={`absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon`}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")}
              className={`absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon`}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Container centered on desktop, full width on mobile */}
        <div className="max-w-[1192px] mx-auto overflow-hidden">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-20 md:gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory px-[20px] md:px-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              // Precise padding to center 280px card on mobile:
              paddingLeft: "calc((100vw - 280px) / 2)",
              paddingRight: "calc((100vw - 280px) / 2)",
            }}
          >
            {/* On desktop (md), we don't want the extreme padding, so we reset it via media-query-like logic or just standard classes */}
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
  const { lang, t } = useLanguage();
  const grouped = useMemo<Record<string, Doctor[]>>(() => {
    return doctors.reduce<Record<string, Doctor[]>>((acc, doctor) => {
      const key = doctor.department || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(doctor);
      return acc;
    }, {});
  }, []);
  const allDoctors = useMemo(() => Object.values(grouped).flat(), [grouped]);
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

  const sortedGroupedEntries = Object.entries(grouped)
    .filter(([, docs]) => Array.isArray(docs) && docs.length > 0)
    .map(([dept, docs]) => [
      dept,
      [...docs].sort((a, b) =>
        (dept === "Anesthesia"
          ? stripTitlePrefix(lang === "ar" ? a.nameAr : a.name)
          : (lang === "ar" ? a.nameAr : a.name)
        ).localeCompare(
          dept === "Anesthesia"
            ? stripTitlePrefix(lang === "ar" ? b.nameAr : b.name)
            : (lang === "ar" ? b.nameAr : b.name),
          locale
        )
      ),
    ] as const)
    .sort(([deptA, docsA], [deptB, docsB]) =>
      (lang === "ar" ? docsA[0]?.departmentAr || deptA : deptA).localeCompare(
        lang === "ar" ? docsB[0]?.departmentAr || deptB : deptB,
        locale
      )
    );

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-4">{t("ourTeam")}</p>
            <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-4">{t("meetOurDoctors")}</h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto text-sm md:text-base">
              {lang === "ar" ? "ابحث عن الطبيب المناسب حسب الأعراض أو التخصص" : "Find the right doctor by symptom or specialty"}
            </p>
          </div>

          {/* Symptom Search */}
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

          {/* Search results */}
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
          ) : (
            /* Department-grouped doctors */
            sortedGroupedEntries.map(([dept, docs]) => (
              <DepartmentRow
                key={dept}
                department={dept}
                departmentAr={docs[0]?.departmentAr || dept}
                docs={docs}
              />
            ))
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
