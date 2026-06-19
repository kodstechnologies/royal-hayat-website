import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { Search, ChevronLeft, ChevronRight, Stethoscope, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { loadDoctors, type Doctor } from "@/data/loadDoctors";
import { departments, deptDoctorAliases, MAIN_CATEGORIES, type MainCategory } from "@/data/departments";
import { Input } from "@/components/ui/input";
import { getDoctorDisplayName } from "@/utils/doctorDisplayName";
import { sortDoctorsInDepartment } from "@/utils/sortDoctorsInDepartment";
import { getDoctorCarouselScrollState, scrollDoctorCarousel, scrollDoctorCarouselToStart, syncDoctorCarouselIndex } from "@/utils/doctorCarousel";


const DoctorCard = memo(({ doc }: { doc: Doctor }) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const displayName = getDoctorDisplayName(doc, lang);
  return (
    <Link
      to={`/doctors/${doc.id}`}
      data-doctor-carousel-card
      dir={isAr ? "rtl" : "ltr"}
      className="relative z-0 block w-[280px] min-h-[430px] flex-shrink-0 snap-center hover:z-10 md:snap-start"
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
            {isAr ? doc.specialtyAr : doc.specialty}
          </p>
          <h3 className="text-[1.2rem] font-serif font-bold text-foreground mb-1 w-full">{displayName}</h3>
          <p className="text-muted-foreground font-body text-xs mb-3 w-full">
            {isAr ? doc.titleAr : doc.title}
          </p>
          {doc.hideBooking !== true && (
            <div
              className={`flex items-center gap-1.5 mb-2 w-full ${
                doc.availableOnline !== false ? "text-green-600" : "text-destructive"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${doc.availableOnline !== false ? "bg-green-500" : "bg-destructive"}`} />
              <span className="font-body text-[10px]">
                {doc.availableOnline !== false
                  ? (isAr ? "متاح للحجز اونلاين" : "Book Online")
                  : (isAr ? "غير متاح للحجز اونلاين" : "Not Available for Online Booking")}
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
const departmentDescriptions: Record<string, { en: string; ar: string }> = {
  "Obstetrics & Gynecology": { en: "Complete maternity care from prenatal through postpartum recovery. Our team provides expert guidance for high-risk pregnancies, minimally invasive gynecological procedures, and comprehensive family planning services.", ar: "رعاية شاملة للأم خلال جميع مراحل الحمل، من المتابعة قبل الولادة وحتى التعافي بعد الولادة. يقدم فريقنا الطبي رعاية متخصصة للحمل عالي الخطورة، وإجراءات أمراض النساء طفيفة التوغل، بالإضافة إلى خدمات شاملة لتنظيم الأسرة." },
  "Internal Medicine": { en: "Comprehensive diagnosis and treatment of complex adult diseases. Our internists specialize in managing chronic conditions, preventive health screenings, and coordinating multidisciplinary care for optimal patient outcomes.", ar: "تشخيص وعلاج شامل لأمراض البالغين المعقدة. يتخصص أطباؤنا في إدارة الحالات المزمنة والفحوصات الوقائية وتنسيق الرعاية متعددة التخصصات لتحقيق أفضل النتائج." },
  "Dermatology": { en: "Expert care for all dermatological needs for adults and children. Our dermatologists offer advanced treatments for skin conditions, cosmetic procedures, and laser therapies using the latest diagnostic technologies.", ar: "رعاية متخصصة لجميع احتياجات الأمراض الجلدية للبالغين والأطفال. يقدم أطباء الجلدية لدينا علاجات متقدمة للأمراض الجلدية والإجراءات التجميلية والعلاج بالليزر باستخدام أحدث التقنيات." },
  "Family Medicine": { en: "Continuous, personalized care for individuals and families of all ages. Our family physicians build lasting relationships with patients, managing everything from routine check-ups to chronic disease management.", ar: "رعاية مستمرة ومخصصة للأفراد والعائلات من جميع الأعمار. يبني أطباء الأسرة لدينا علاقات دائمة مع المرضى ويديرون كل شيء من الفحوصات الروتينية إلى إدارة الأمراض المزمنة." },
  "Anesthesia": { en: "Top-tier anesthesia services ensuring patient safety and comfort. Our anesthesiologists provide pre-operative assessments, pain-free surgical experiences, and post-operative pain management using modern monitoring equipment.", ar: "نقدّم خدمات تخدير متقدمة على أعلى مستوى لضمان سلامة المريض وراحته قبل وأثناء وبعد العمليات الجراحية. يقوم أطباء التخدير لدينا بإجراء تقييمات ما قبل العملية، وتوفير تجربة جراحية خالية من الألم، بالإضافة إلى إدارة فعّالة للألم بعد العمليات باستخدام أحدث تقنيات وأجهزة المراقبة الطبية." },
  "Anesthesia & Intensive Care": { en: "Top-tier anesthesia services ensuring patient safety and comfort. Our anesthesiologists provide pre-operative assessments, pain-free surgical experiences, and post-operative pain management using modern monitoring equipment.", ar: "نقدّم خدمات تخدير متقدمة على أعلى مستوى لضمان سلامة المريض وراحته قبل وأثناء وبعد العمليات الجراحية. يقوم أطباء التخدير لدينا بإجراء تقييمات ما قبل العملية، وتوفير تجربة جراحية خالية من الألم، بالإضافة إلى إدارة فعّالة للألم بعد العمليات باستخدام أحدث تقنيات وأجهزة المراقبة الطبية." },
  "Neonatal": { en: "Dedicated care for newborns requiring specialized medical attention. Our neonatal unit provides advanced life support, developmental care, and family-centered services for premature and critically ill infants.", ar: "رعاية متخصصة ومتكاملة لحديثي الولادة الذين يحتاجون إلى عناية طبية دقيقة. يوفر قسم حديثي الولادة لدينا دعمًا متقدمًا لإنقاذ الحياة، ورعاية لنمو وتطور الطفل، إلى جانب خدمات تركز على الأسرة لضمان أفضل رعاية للرضع الخدّج والحالات الحرجة." },
  "General Surgery": { en: "Exceptional surgical care combining precision, safety, and rapid recovery. Our surgeons perform a wide range of minimally invasive and laparoscopic procedures, including bariatric surgery, hernia repair, and oncological operations.", ar: "رعاية جراحية متميزة تجمع بين الدقة العالية، ومعايير الأمان، وسرعة التعافي. يقدم جراحونا مجموعة واسعة من الإجراءات الجراحية طفيفة التوغل وجراحات المنظار، بما في ذلك جراحات السمنة، وإصلاح الفتق، وجراحات الأورام، وذلك باستخدام أحدث التقنيات الطبية لضمان أفضل النتائج للمرضى." },
  "La Cosmetique": { en: "Advanced cosmetic and reconstructive surgery in a luxurious clinical setting. Our board-certified surgeons combine artistry with precision for body contouring, facial rejuvenation, rhinoplasty, and non-surgical aesthetic treatments.", ar: "جراحة تجميلية وترميمية متقدمة في بيئة سريرية فاخرة. يجمع جراحونا المعتمدون بين الفن والدقة لنحت الجسم وتجديد الوجه وتجميل الأنف والعلاجات التجميلية غير الجراحية." },
  "Pediatric": { en: "World-class pediatric care with warmth and a child-centered approach. From routine wellness visits to specialized treatments, our pediatricians ensure every child receives compassionate, evidence-based medical attention.", ar: "رعاية أطفال على مستوى عالمي تجمع بين الدفء الإنساني والنهج المتمحورة حول الطفل. من الزيارات الدورية والفحوصات الوقائية إلى العلاجات التخصصية، يحرص أطباؤنا على تقديم رعاية طبية شاملة ومبنية على الأدلة، تضمن حصول كل طفل على اهتمام طبي متعاطف وعالي الجودة في بيئة آمنة وداعمة." },
  "Radiology": { en: "State-of-the-art diagnostic imaging services including MRI, CT, ultrasound, and interventional radiology. Our radiologists provide accurate, timely interpretations to support clinical decision-making across all departments.", ar: "خدمات متقدمة للتصوير التشخيصي باستخدام أحدث التقنيات الطبية، تشمل التصوير بالرنين المغناطيسي (MRI)، والأشعة المقطعية (CT)، والموجات فوق الصوتية، والأشعة التداخلية. يقدّم أخصائيو الأشعة لدينا تقارير دقيقة وسريعة لدعم التشخيص واتخاذ القرارات العلاجية في مختلف التخصصات الطبية." },
  "Nutricare": { en: "Personalized clinical nutrition and dietetic services for all ages. Our registered dietitians provide medical nutrition therapy for chronic diseases, weight management, pre/post bariatric surgery diets, and pregnancy nutrition.", ar: "خدمات تغذية علاجية وحمية مخصصة لجميع الفئات العمرية. يقدم أخصائيو التغذية المعتمدون لدينا علاجًا غذائيًا طبيًا للحالات المزمنة، وإدارة الوزن، وخططًا غذائية قبل وبعد جراحات السمنة، بالإضافة إلى التغذية خلال فترة الحمل، وذلك وفق أعلى المعايير الطبية لدعم الصحة العامة وتحسين جودة الحياة." },
  "Pharmacy": { en: "Full-service hospital pharmacy offering prescription medications, patient counseling, and medication safety. Our pharmacists ensure accurate dispensing and provide expert guidance on medication use and interactions.", ar: "صيدلية متكاملة داخل المستشفى توفر الأدوية الموصوفة، والاستشارات الدوائية، وخدمات تعزيز سلامة استخدام الأدوية. يحرص فريق الصيادلة لدينا على صرف الأدوية بدقة عالية، مع تقديم إرشادات متخصصة حول طريقة الاستخدام والتداخلات الدوائية لضمان أفضل النتائج العلاجية للمرضى." },
  "Clinical Pharmacy": { en: "Patient-focused pharmaceutical care ensuring safe and effective medication use. Our clinical pharmacists collaborate with medical teams to optimize drug therapy, prevent interactions, and provide medication counseling.", ar: "رعاية دوائية متخصصة تتمحور حول سلامة المريض وفعالية العلاج. يعمل الصيادلة الإكلينيكيون لدينا بالتعاون مع الفرق الطبية لتحسين الخطط الدوائية، والحد من التداخلات والمضاعفات الدوائية، إلى جانب تقديم التوعية والإرشادات اللازمة لضمان الاستخدام الآمن والفعّال للأدوية." },
  "Dental": { en: "Exceptional dental care in a luxurious setting using advanced technology. From pediatric dentistry and endodontics to prosthodontics, cosmetic smile makeovers, and periodontal treatments.", ar: "رعاية متقدمة لصحة الفم والأسنان ضمن بيئة فاخرة وباستخدام أحدث التقنيات الطبية. نقدم مجموعة شاملة من خدمات طب الأسنان، تشمل طب أسنان الأطفال، وعلاج جذور الأسنان، وتركيبات الأسنان، وتجميل الابتسامة، وعلاج أمراض اللثة، لضمان ابتسامة صحية وجميلة بأعلى معايير الجودة والرعاية." },
  "IVF": { en: "At Royale Hayat Hospital, we blend expertise with cutting-edge technology to offer the most advanced infertility treatments. Our dedicated team of physicians, counselors, and specialists ensures high-quality, compassionate care in a luxurious setting.", ar: "في مستشفى رويال حياة، نجمع بين الخبرة الطبية والتقنيات الحديثة المتقدمة لتقديم أحدث علاجات تأخر الإنجاب، ضمن بيئة علاجية راقية وفريق متخصص من الأطباء والاستشاريين والمرشدين لضمان رعاية طبية وإنسانية عالية الجودة." },
  "Reproductive Medicine & IVF": { en: "At Royale Hayat Hospital, we blend expertise with cutting-edge technology to offer the most advanced infertility treatments. Our dedicated team of physicians, counselors, and specialists ensures high-quality, compassionate care in a luxurious setting.", ar: "في مستشفى رويال حياة، نجمع بين الخبرة الطبية والتقنيات الحديثة المتقدمة لتقديم أحدث علاجات تأخر الإنجاب، ضمن بيئة علاجية راقية وفريق متخصص من الأطباء والاستشاريين والمرشدين لضمان رعاية طبية وإنسانية عالية الجودة." },
  "Laboratory": { en: "Comprehensive clinical laboratory and pathology services with rapid, accurate diagnostic testing. Our team includes histopathologists, microbiologists, and hematologists performing specialized analyses.", ar: "خدمات متكاملة للمختبرات الطبية وعلم الأمراض، مع فحوصات تشخيصية دقيقة وسريعة وفق أعلى المعايير الطبية. يضم فريقنا نخبة من اخصائيي علم الأمراض النسيجية، والأحياء الدقيقة، وأمراض الدم، لتقديم تحاليل متخصصة تدعم التشخيص الدقيق وخطط العلاج الفعّالة." },
  "Laboratory Services": { en: "Comprehensive clinical laboratory and pathology services with rapid, accurate diagnostic testing. Our team includes histopathologists, microbiologists, and hematologists performing specialized analyses.", ar: "خدمات متكاملة للمختبرات الطبية وعلم الأمراض، مع فحوصات تشخيصية دقيقة وسريعة وفق أعلى المعايير الطبية. يضم فريقنا نخبة من اخصائيي علم الأمراض النسيجية، والأحياء الدقيقة، وأمراض الدم، لتقديم تحاليل متخصصة تدعم التشخيص الدقيق وخطط العلاج الفعّالة." },
  "ENT (Ear, Nose & Throat)": { en: "Expert care for conditions affecting the ear, nose, throat, head, and neck. Our ENT specialists provide surgical and non-surgical treatments for hearing disorders, sinus conditions, voice disorders, and head & neck tumors.", ar: "رعاية طبية متخصصة لحالات الأذن والأنف والحنجرة والرأس والرقبة. يقدم أخصائيو الأنف والأذن والحنجرة لدينا علاجات جراحية وغير جراحية لمشكلات السمع، واضطرابات الجيوب الأنفية، واضطرابات الصوت، وأورام الرأس والرقبة، باستخدام أحدث التقنيات الطبية لضمان أفضل النتائج للمرضى." },
};
const departmentEnLabels: Record<string, string> = {
  "Laboratory": "Laboratory Services",
  "Laboratory Services": "Laboratory Services",
  "Radiology": "Center for Diagnostic Imaging",
};
const departmentArLabels: Record<string, string> = {
  "Dental": "طب الأسنان",
  "Obstetrics & Gynecology": "امراض النساء والولادة",
  "Neonatal": "طب حديثي الولادة",
  "Anesthesia": "التخدير",
  "Anesthesia & Intensive Care": "التخدير",
  "Internal Medicine": "الطب الباطنية",
  "Family Medicine": "طب العائلة",
  "Dermatology": "الأمراض الجلدية",
  "ENT (Ear, Nose & Throat)": "الأنف والأذن والحنجرة",
  "Nutricare": "قسم التغذية",
  "La Cosmetique": "قسم جراحة التجميل",
  "IVF": "طب الإنجاب وأطفال الأنابيب",
  "Reproductive Medicine & IVF": "طب الإنجاب وأطفال الأنابيب",
  "Reproductive Medicine": "طب الإنجاب وأطفال الأنابيب",
  "Laboratory": "الخدمات المخبرية",
  "Laboratory Services": "الخدمات المخبرية",
  "Radiology": "الأشعة التشخيصية",
  "Pharmacy": "الصيدلية",
  "Clinical Pharmacy": "الصيدلة الإكلينيكية",
};
const DepartmentRow = memo(({ department, departmentAr, docs }: { department: string; departmentAr: string; docs: Doctor[] }) => {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
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

    scheduleUpdate();
    scrollDoctorCarouselToStart(el);
    const delayedChecks = [
      window.setTimeout(() => {
        scrollDoctorCarouselToStart(el);
        scheduleUpdate();
      }, 150),
      window.setTimeout(() => {
        scrollDoctorCarouselToStart(el);
        scheduleUpdate();
      }, 600),
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
  }, [docs, lang, updateScrollState]);

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
  const deptDesc = departmentDescriptions[department];
  return (
    <div className="mb-14">
      <div className="max-w-[1192px] mx-auto mb-6">
        <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
          {lang === "ar" ? (departmentArLabels[department] ?? departmentAr) : (departmentEnLabels[department] ?? department)}
        </h3>
        {deptDesc && (
          <div className="bg-popover border border-border/50 rounded-2xl p-4 md:p-5 shadow-sm">
            <p className="text-muted-foreground font-body text-base leading-relaxed">
              {lang === "ar" ? deptDesc.ar : deptDesc.en}
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
            ref={scrollRef}
            dir="ltr"
            className="doctors-carousel-track flex w-full items-stretch gap-4 overflow-x-auto pb-8 snap-x snap-mandatory max-md:scroll-px-[calc(50%-140px)] max-md:px-[calc(50%-140px)] md:gap-6 md:px-0 md:scroll-px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
          >
            {docs.map((doc) => (
              <DoctorCard key={doc.id} doc={doc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
DepartmentRow.displayName = "DepartmentRow";
const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorCatalog, setDoctorCatalog] = useState<Doctor[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const { lang, t } = useLanguage();
  useEffect(() => {
    let cancelled = false;
    void loadDoctors().then((list) => {
      if (cancelled) return;
      setDoctorCatalog(list);
      setCatalogLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const deptToMainCategory = useMemo<Record<string, MainCategory>>(() => {
    const map: Record<string, MainCategory> = {};
    departments.forEach((d) => {
      map[d.name] = d.mainCategory;
    });
    return map;
  }, []);
  const doctorDeptOrderIndex = useMemo(() => {
    const m = new Map<string, number>();
    departments.forEach((d, i) => {
      m.set(d.name, i);
      deptDoctorAliases[d.name]?.forEach((alias) => {
        m.set(alias, i);
      });
    });
    const pharmacyIdx = departments.findIndex((d) => d.name === "Royale Hayat Pharmacy");
    if (pharmacyIdx >= 0) {
      m.set("Pharmacy", pharmacyIdx);
      m.set("Clinical Pharmacy", pharmacyIdx + 0.5);
    }
    return m;
  }, []);
  const DEPT_ORDER_FALLBACK = 100_000;
  const getDeptMainCategory = useCallback((dept: string): MainCategory => {
    if (deptToMainCategory[dept]) return deptToMainCategory[dept];
    for (const d of departments) {
      const aliases = deptDoctorAliases[d.name];
      if (aliases?.includes(dept)) return d.mainCategory;
    }
    const clinicalSpeciality: string[] = [
      "Obstetrics & Gynecology", "Neonatal", "Pediatric", "Pediatrics",
      "General Surgery", "Anesthesia", "Anesthesia & Intensive Care",
      "Internal Medicine", "Family Medicine", "ENT (Ear, Nose & Throat)", "ENT",
      "La Cosmetique", "Plastic Surgery & Cosmetology", "IVF", "Reproductive Medicine",
      "Dermatology", "Dental", "Dental Clinic", "Pain Management", "Nutricare",
    ];
    const clinicalSupport: string[] = [
      "Laboratory", "Radiology", "Intensive Care", "Clinical Pharmacy",
      "Pharmacy", "Al Safwa",
    ];
    const homeCare: string[] = ["Royale Home Health", "Physiotherapy", "Home Health"];
    if (clinicalSpeciality.some(a => dept.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(dept.toLowerCase()))) return "Clinical Speciality";
    if (clinicalSupport.some(a => dept.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(dept.toLowerCase()))) return "Clinical Support Service";
    if (homeCare.some(a => dept.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(dept.toLowerCase()))) return "Home Care Service";
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
    return allDoctors.filter((doc) => {
      const searchableFields = [
        doc.name, doc.nameAr, doc.specialty, doc.specialtyAr,
        doc.department, doc.departmentAr, doc.title, doc.titleAr,
        ...(doc.symptoms || []),
      ];
      return searchableFields.some((field) => (field || "").toLowerCase().includes(query));
    });
  }, [allDoctors, searchQuery]);
  const isSearching = searchQuery.trim().length > 0;
  const locale = lang === "ar" ? "ar" : "en";
  const sortedGroupedEntries = useMemo(() => {
    const sortDocsWithinDept = (dept: string, docs: Doctor[]) =>
      sortDoctorsInDepartment(docs, dept, lang);
    const orderOf = (dept: string) => doctorDeptOrderIndex.get(dept) ?? DEPT_ORDER_FALLBACK;
    return Object.entries(grouped)
      .filter(([, docs]) => Array.isArray(docs) && docs.length > 0)
      .map(([dept, docs]) => [dept, sortDocsWithinDept(dept, docs)] as const)
      .sort(([deptA], [deptB]) => {
        const da = orderOf(deptA);
        const db = orderOf(deptB);
        if (da !== db) return da - db;
        return deptA.localeCompare(deptB, locale);
      });
  }, [grouped, lang, locale, doctorDeptOrderIndex]);
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
