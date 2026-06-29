import { useState, useRef, useEffect, useMemo } from "react";
import { Menu, X, Search, ChevronDown, Building2, Stethoscope, Users, Home, Heart, Star, ShieldCheck, Phone, MapPin, Bed, Sparkles, BookOpen, Coffee, Droplets, ClipboardList, UserCheck, ScrollText, Baby, Mail, Briefcase, Info, ConciergeBell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import logoFull from "@/assets/rhh-logo-full-color.png";
import { fetchAllActiveDoctors, isMongoDoctorId } from "@/api/doctors";
type SearchIndexItem = {
  label: string;
  labelAr: string;
  type: string;
  typeAr: string;
  href: string;
};
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogo] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const { data: activeDoctors = [] } = useQuery({
    queryKey: ["header-doctor-search"],
    queryFn: fetchAllActiveDoctors,
    staleTime: 5 * 60 * 1000,
  });
  const doctorSearchItems = useMemo<SearchIndexItem[]>(
    () =>
      activeDoctors
        .filter((doc) => isMongoDoctorId(doc.id))
        .map((doc) => ({
          label: doc.name,
          labelAr: doc.nameAr,
          type: `Doctor · ${doc.specialty}`,
          typeAr: `طبيب · ${doc.specialtyAr}`,
          href: `/doctors/${doc.id}`,
        })),
    [activeDoctors],
  );
  const { lang, setLang, t } = useLanguage();
  const phoneDisplay = "+965 2536 0000";
  const phoneTextClass = "inline-block [direction:ltr] [unicode-bidi:isolate]";
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const logoRowRef = useRef<HTMLDivElement>(null);
  const navRowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (isMobile) {
        if (currentY > lastScrollY.current && currentY > 80) {
          setMenuOpen(false);
        }
        lastScrollY.current = currentY;
        return;
      }
      setHeaderVisible(true);
      if (currentY > lastScrollY.current && currentY > 80) {
        setMenuOpen(false);
      }
      lastScrollY.current = currentY;
    };
    const handleResize = () => {
      if (window.matchMedia("(max-width: 1023px)").matches) {
        setHeaderVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const fullHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${fullHeight}px`);
      }
    };
    updateHeaderHeight();
    requestAnimationFrame(updateHeaderHeight);
    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) observer.observe(headerRef.current);
    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, [headerVisible, lang, menuOpen, searchOpen]);
  const aboutSubLinks = [
    { label: t("ourStory"), href: "/about-us?section=history", icon: BookOpen, desc: lang === "ar" ? "قصة مستشفى رويال حياة" : "The story of Royale Hayat Hospital" },
    { label: lang === "ar" ? "الرسالة والقيم" : "Mission & Values", href: "/about-us?section=mission", icon: Heart, desc: lang === "ar" ? "رسالتنا وقيمنا الأساسية" : "Our mission and core values" },
    { label: t("chairmanMessage"), href: "/about-us?section=chairman", icon: Users, desc: lang === "ar" ? "كلمة رئيس مجلس الإدارة" : "A message from the Chairman" },
    { label: lang === "ar" ? "فريق القيادة" : "Leadership Team", href: "/about-us?section=leadership", icon: UserCheck, desc: lang === "ar" ? "تعرف على فريق القيادة" : "Meet our visionary leaders" },
    { label: lang === "ar" ? "المسؤولية الاجتماعية" : "CSR", href: "/csr", icon: Heart, desc: lang === "ar" ? "المسؤولية الاجتماعية للمؤسسة" : "Corporate Social Responsibility" },
  ];
  const medicalSubLinks = [
    { label: t("departments"), href: "/departments", icon: Building2, desc: t("deptCount") },
    { label: t("doctors"), href: "/doctors", icon: Stethoscope, desc: t("meetOurDoctors") },
    { label: lang === "ar" ? "رويال للرعاية المنزلية" : "Royale Home Health", href: "/home-health", icon: Home, desc: lang === "ar" ? "رعاية طبية متميزة في المنزل" : "Premium medical care at home" },
  ];
  const hospitalitySubLinks = [
    { label: lang === "ar" ? "قاعات الإستقبال" : "Birth Celebration Halls", href: "/hospitality?section=halls", icon: Star, desc: lang === "ar" ? "مساحة خاصة للاحتفال بقدوم مولودك" : "A private space to celebrate your baby's arrival" },
    { label: lang === "ar" ? "الأجنحة الفاخرة" : "Exclusive Suites", href: "/hospitality?section=suites", icon: Bed, desc: lang === "ar" ? "مساحة هادئة وشخصية للراحة والتعافي والتواصل" : "A calm, personal space to rest, recover, and bond" },
    { label: lang === "ar" ? "المناسبات داخل الأجنحة" : "In-Suite Celebration Experiences", href: "/in-room-events", icon: Sparkles, desc: lang === "ar" ? "احتفالات مميزة في خصوصية جناحك" : "Create meaningful celebrations in the comfort and privacy of your own suite" },
    { label: lang === "ar" ? "إليمنتس سبا (بانيان تري)" : "Elements Spa (by Banyan Tree)", href: "/hospitality?section=spa", icon: Droplets, desc: lang === "ar" ? "ملاذ هادئ للاسترخاء والتجديد" : "A serene sanctuary for relaxation and renewal" },
    { label: lang === "ar" ? "الليوان بيسترو" : "Al Liwan Bistro", href: "/hospitality?section=cafe", icon: Coffee, desc: lang === "ar" ? "بيئة راقية لتجارب طعام استثنائية" : "A refined setting for exceptional dining experiences" },
    { label: lang === "ar" ? "كافيه الطابق الخامس" : "The 5th Floor Café", href: "/fifth-floor-cafe", icon: Coffee, desc: lang === "ar" ? "مساحة مريحة للقهوة والمرطبات الخفيفة" : "A cozy space for light bites and refreshments" },
    { label: lang === "ar" ? "خدمات تصوير المواليد" : "Newborn Photography Services", href: "/newborn-photography", icon: Baby, desc: lang === "ar" ? "التقط أثمن لحظات الحياة" : "Capture Life's Most Precious Moments" },
  ];
  const patientsSubLinks = [
    { label: lang === "ar" ? "التمريض" : "Nursing", href: "/patients-visitors?tab=nursing", icon: Heart, desc: lang === "ar" ? "رعاية تمريضية متفانية" : "Dedicated nursing care" },
    { label: lang === "ar" ? "معلومات الدخول إلى المستشفى" : "Admission Information", href: "/patients-visitors?tab=admission", icon: ClipboardList, desc: lang === "ar" ? "ما تحتاجون معرفته قبل الدخول" : "What to know before admission" },
    { label: lang === "ar" ? "التأمين الصحي" : "Health Insurance", href: "/patients-visitors?tab=insurance", icon: ShieldCheck, desc: lang === "ar" ? "المطالبات والموافقات المسبقة" : "Claims and pre-approvals" },
    { label: lang === "ar" ? "أثناء إقامتك" : "During Your Stay", href: "/patients-visitors?tab=during-stay", icon: Bed, desc: lang === "ar" ? "خدمات الغرف والراحة" : "Room services and comfort" },
    { label: lang === "ar" ? "باقات الغرف" : "Birthing Suites Packages", href: "/patients-visitors?tab=rooms-package", icon: Bed, desc: lang === "ar" ? "باقات الغرف الفاخرة" : "Private Suites Packages" },
    { label: lang === "ar" ? "وثيقة حقوق المريض" : "Patient Bill of Rights", href: "/patients-visitors?tab=bill-of-rights", icon: ScrollText, desc: lang === "ar" ? "حقوقك ومسؤولياتك" : "Your rights and responsibilities" },
    { label: lang === "ar" ? "المرضى الدوليون" : "International Patient", href: "/international-patient", icon: MapPin, desc: lang === "ar" ? "دعم مخصص للمرضى الدوليين" : "Dedicated international patient support" },
    { label: lang === "ar" ? "نظام أمان الرضّع " : " Infant Security", href: "/infant-security", icon: Baby, desc: lang === "ar" ? "حماية متقدمة للمواليد على مدار الساعة" : "Advanced 24/7 newborn protection system" },
  ];
  const workWithUsSubLinks = [
    { label: lang === "ar" ? "ثقافة العمل" : "Work Culture", href: "/work-with-us?section=culture", icon: Heart, desc: lang === "ar" ? "الحياة في مستشفى رويال حياة" : "Life at Royale Hayat Hospital" },
    { label: lang === "ar" ? "الوظائف المتاحة" : "Open Positions", href: "/work-with-us?section=positions", icon: Users, desc: lang === "ar" ? "تصفح جميع الفرص الوظيفية" : "Browse all career opportunities" },
  ];
  const navItems: {
    label: string;
    href: string;
    hasDropdown?: string;
    icon: LucideIcon;
  }[] = [
    { label: t("aboutUsNav"), href: "/about-us", hasDropdown: "about", icon: Info },
    { label: t("medicalServices"), href: "/medical-services", hasDropdown: "medical", icon: Stethoscope },
    { label: t("hospitalityServices"), href: "/hospitality", hasDropdown: "hospitality", icon: ConciergeBell },
    { label: t("patientsVisitors"), href: "/patients-visitors", hasDropdown: "patients", icon: Users },
    { label: lang === "ar" ? "إنضم الينا" : "Work With Us", href: "/work-with-us", hasDropdown: "workwithus", icon: Briefcase },
  ];
  const contactSubLinks = [
    { label: t("bookAppointment"), href: "/book-appointment", icon: Phone, desc: lang === "ar" ? "احجز موعدك مع أطبائنا" : "Schedule your visit with our doctors" },
    { label: lang === "ar" ? "المرضى الدوليون" : "International Patient", href: "/international-patient", icon: MapPin, desc: lang === "ar" ? "دعم مخصص للمرضى الدوليين" : "Dedicated support for international patients" },
    { label: lang === "ar" ? "اتصل بنا" : "Call Us", href: "tel:+96525360000", icon: Phone, desc: phoneDisplay },
  ];
  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };
  const handleBookAppointmentClick = (e: any) => {
    if (location.pathname === "/book-appointment") {
      e.preventDefault();
      navigate("/book-appointment", { state: { resetBookingFlow: Date.now() } });
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };
  const searchIndex = useMemo(() => {
    const items: SearchIndexItem[] = [];
    items.push(
      { label: "Home", labelAr: "الرئيسية", type: "Page", typeAr: "صفحة", href: "/" },
      { label: "About Us", labelAr: "من نحن", type: "Page", typeAr: "صفحة", href: "/about-us" },
      { label: "Medical Services", labelAr: "الخدمات الطبية", type: "Page", typeAr: "صفحة", href: "/medical-services" },
      { label: "Book Appointment", labelAr: "حجز موعد", type: "Page", typeAr: "صفحة", href: "/book-appointment" },
      { label: "Hospitality Services", labelAr: "خدمات الضيافة", type: "Page", typeAr: "صفحة", href: "/hospitality" },
      { label: "Patients Info", labelAr: "معلومات للمرضى والزوار", type: "Page", typeAr: "صفحة", href: "/patients-visitors" },
      { label: "Work With Us", labelAr: "إنضم الينا", type: "Page", typeAr: "صفحة", href: "/work-with-us" },
      { label: "Al Safwa Program", labelAr: "برنامج الصفوة", type: "Page", typeAr: "صفحة", href: "/al-safwa" },
      { label: "Home Health", labelAr: "الرعاية المنزلية", type: "Page", typeAr: "صفحة", href: "/home-health" },
      { label: "Doctors", labelAr: "الأطباء", type: "Page", typeAr: "صفحة", href: "/doctors" },
      { label: "Departments", labelAr: "الأقسام", type: "Page", typeAr: "صفحة", href: "/departments" },
      { label: "International Patient", labelAr: "المرضى الدوليون", type: "Page", typeAr: "صفحة", href: "/international-patient" },
      { label: "Downloads", labelAr: "التحميلات", type: "Page", typeAr: "صفحة", href: "/downloads" },
      { label: "My Medical Reports", labelAr: "تقاريري الطبية", type: "Page", typeAr: "صفحة", href: "/my-medical-reports" },
    );
    const deptNames = [
      { en: "Obstetrics & Gynecology", ar: "التوليد وأمراض النساء" },
      { en: "Family Medicine", ar: "طب الأسرة" },
      { en: "Al Safwa Healthcare Program", ar: "برنامج الصفوة للرعاية الصحية" },
      { en: "Pediatrics & Neonatology", ar: "طب الأطفال وحديثي الولادة" },
      { en: "Internal Medicine", ar: "الطب الباطني" },
      { en: "General Surgery", ar: "الجراحة العامة" },
      { en: "Orthopedics", ar: "جراحة العظام" },
      { en: "ENT", ar: "الأنف والأذن والحنجرة" },
      { en: "Dermatology", ar: "الأمراض الجلدية" },
      { en: "Dental", ar: "طب الأسنان" },
      { en: "Cardiology", ar: "القلب" },
      { en: "Ophthalmology", ar: "العيون" },
      { en: "Urology", ar: "المسالك البولية" },
      { en: "Radiology", ar: "الأشعة" },
      { en: "Laboratory", ar: "المختبر" },
      { en: "Physiotherapy", ar: "العلاج الطبيعي" },
      { en: "Plastic Surgery & Cosmetology", ar: "الجراحة التجميلية" },
      { en: "Psychiatry", ar: "الطب النفسي" },
      { en: "Nutrition & Dietetics", ar: "التغذية" },
      { en: "Emergency", ar: "الطوارئ" },
    ];
    deptNames.forEach(d => {
      items.push({ label: d.en, labelAr: d.ar, type: "Department", typeAr: "قسم", href: "/departments" });
    });
    items.push(...doctorSearchItems);
    const services = [
      { en: "Luxury Suites", ar: "الأجنحة الفاخرة", href: "/hospitality" },
      { en: "Elements Spa", ar: "إليمنتس سبا", href: "/hospitality" },
      { en: "Al Liwan Bistro", ar: "الليوان بيسترو", href: "/hospitality" },
      { en: "Newborn Photography", ar: "تصوير المواليد", href: "/patients-visitors" },
      { en: "Health Insurance", ar: "التأمين الصحي", href: "/patients-visitors" },
      { en: "Nursing Services", ar: "خدمات التمريض", href: "/home-health" },
      { en: "Post-Surgery Care", ar: "الرعاية بعد الجراحة", href: "/home-health" },
      { en: "Executive Health Screening", ar: "الفحص الصحي التنفيذي", href: "/al-safwa" },
      { en: "Chairman Message", ar: "رسالة رئيس مجلس الإدارة", href: "/about-us" },
      { en: "Awards & Accreditations", ar: "الجوائز والاعتمادات", href: "/#awards" },
      { en: "Insurance Partners", ar: "شركاء التأمين", href: "/#insurance" },
      { en: "Patient Testimonials", ar: "شهادات المرضى", href: "/#testimonials" },
    ];
    services.forEach(s => {
      items.push({ label: s.en, labelAr: s.ar, type: "Service", typeAr: "خدمة", href: s.href });
    });
    const symptoms = [
      { en: "Headache", ar: "صداع", href: "/departments" },
      { en: "Fever", ar: "حمى", href: "/departments" },
      { en: "Back Pain", ar: "ألم الظهر", href: "/departments" },
      { en: "Pregnancy", ar: "حمل", href: "/departments" },
      { en: "Skin Rash", ar: "طفح جلدي", href: "/departments" },
      { en: "Chest Pain", ar: "ألم في الصدر", href: "/departments" },
      { en: "Toothache", ar: "ألم الأسنان", href: "/departments" },
      { en: "Eye Problems", ar: "مشاكل العيون", href: "/departments" },
      { en: "Joint Pain", ar: "ألم المفاصل", href: "/departments" },
      { en: "Cough", ar: "سعال", href: "/departments" },
      { en: "Allergy", ar: "حساسية", href: "/departments" },
      { en: "Diabetes", ar: "سكري", href: "/departments" },
      { en: "High Blood Pressure", ar: "ضغط الدم المرتفع", href: "/departments" },
    ];
    symptoms.forEach(s => {
      items.push({ label: s.en, labelAr: s.ar, type: "Symptom", typeAr: "عرض", href: s.href });
    });
    return items;
  }, [doctorSearchItems]);
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return searchIndex
      .filter(item => item.label.toLowerCase().includes(q) || item.labelAr.includes(searchQuery))
      .slice(0, 8);
  }, [searchQuery, searchIndex]);
  const linkClass =
    "text-foreground font-body text-[14px] tracking-wide hover:text-accent transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left inline-flex items-center whitespace-nowrap";
  const isAr = lang === "ar";
  const dropdownSubLinkClass =
    "flex items-start gap-4 p-3 rounded-xl hover:bg-background transition-colors group w-full";
  const dropdownSubTextClass =
    "font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors text-start";
  const dropdownSubDescClass =
    "font-body text-xs text-muted-foreground mt-0.5 text-start";
  const getSubLinks = (key: string) => {
    switch (key) {
      case "about": return aboutSubLinks;
      case "medical": return medicalSubLinks;
      case "hospitality": return hospitalitySubLinks;
      case "patients": return patientsSubLinks;
      case "workwithus": return workWithUsSubLinks;
      case "contact": return contactSubLinks;
      default: return [];
    }
  };
  const isScrollableDropdown = (key: string) => key === "hospitality" || key === "patients";
  const dropdownScrollListClass =
    "min-h-0 flex-1 overflow-y-auto overscroll-y-contain pe-1 pb-3 scroll-pb-3";
  const BritainFlag = () => (
    <svg viewBox="0 0 60 30" className="w-5 h-3 rounded-sm overflow-hidden" aria-hidden="true">
      <clipPath id="s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
      <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
  const KuwaitFlag = () => (
    <svg viewBox="0 0 60 30" className="w-5 h-3 rounded-sm overflow-hidden" aria-hidden="true">
      <rect width="60" height="10" fill="#007A3D" />
      <rect y="10" width="60" height="10" fill="#FFFFFF" />
      <rect y="20" width="60" height="10" fill="#CE1126" />
      <path d="M0,0 L15,15 L0,30 Z" fill="#000000" />
    </svg>
  )
  return (
    <>
      <header
        ref={headerRef}
        className="bg-popover border-b border-border fixed top-0 left-0 right-0 z-50"
      >
        <div className="lg:overflow-visible">
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-popover border-b border-border shadow-lg z-50"
            >
              <div className="container mx-auto px-6 py-4 ">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div className="max-w-2xl mx-auto mt-2 bg-popover border border-border rounded-xl overflow-hidden shadow-lg">
                    {searchResults.map((s) => (
                      <button
                        key={s.label + s.href}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition-colors text-left"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          if (s.href.startsWith("/#")) {
                            navigate("/");
                            setTimeout(() => {
                              document.querySelector(s.href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
                            }, 300);
                          } else if (s.href.startsWith("#")) {
                            document.querySelector(s.href)?.scrollIntoView({ behavior: "smooth" });
                          } else {
                            navigate(s.href);
                          }
                        }}
                      >
                        <span className="font-body text-sm text-foreground">{lang === "ar" ? s.labelAr : s.label}</span>
                        <span className="text-xs font-body text-muted-foreground bg-secondary/20 px-2 py-0.5 rounded-full">{lang === "ar" ? s.typeAr : s.type}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="max-w-2xl mx-auto mt-2 bg-popover border border-border rounded-xl p-4 shadow-lg text-center">
                    <p className="font-body text-sm text-muted-foreground">{lang === "ar" ? "لا توجد نتائج" : "No results found"}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          ref={logoRowRef}
          className={`hidden md:block border-b border-border/50 transition-all duration-300 ease-in-out overflow-hidden ${
            headerVisible
              ? "md:max-h-[240px] md:opacity-100"
              : "md:max-h-0 md:opacity-0 md:border-b-0 md:pointer-events-none"
          }`}
        >
          <div className="container mx-auto flex items-center justify-between py-2.5 md:py-3 px-4 md:px-6 gap-3">
            <div className="flex-1 flex items-center justify-start">
              <div className="flex items-center bg-muted/40 rounded-full border border-border p-0.5 md:scale-95 lg:scale-100 origin-left">
                <button
                  onClick={() => setLang("en")}
                  lang="en"
                  className={`rounded-full font-body font-semibold tracking-wide transition-all duration-300 !leading-none flex items-center justify-center px-2 md:px-2.5 h-6.5 md:h-7 !text-[10px] md:!text-[11px] ${lang === "en"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground hover:bg-background/60"
                    }`}
                  aria-label="English"
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("ar")}
                  lang="ar"
                  className={`rounded-full font-arabic font-semibold transition-all duration-300 !leading-none flex items-center justify-center px-2 md:px-2.5 h-6.5 md:h-7 !text-[10px] md:!text-[11px] ${lang === "ar"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground hover:bg-background/60"
                    }`}
                  aria-label="العربية"
                >
                  العربية
                </button>
              </div>
            </div>
            <Link to="/" className="shrink-0">
              <img src={logoFull} alt="Royale Hayat Hospital" className="h-14 md:h-16 lg:h-[72px] w-auto" />
            </Link>
            <div className="flex-1 flex items-center justify-end">
              <div className="flex flex-col lg:flex-row items-end justify-end gap-y-1 lg:gap-y-0 lg:gap-x-4 font-body text-xs lg:text-sm text-muted-foreground">
                <a href="tel:+96525360000" className="inline-flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap">
                  <Phone className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> <span className={phoneTextClass}>{phoneDisplay}</span>
                </a>
                <a href="mailto:info@royalehayat.com" className="inline-flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap">
                  <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> info@royalehayat.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div ref={navRowRef} className="container mx-auto flex items-center justify-between py-1.5 px-3 md:py-2 md:px-6 gap-2 md:gap-4">
          <Link to="/" className="md:hidden flex-shrink-0">
            <img src={logoFull} alt="Royale Hayat Hospital" className="h-7 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center flex-1 justify-between">
            {navItems.map((item) => {
              const NavIcon = item.icon;
              return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleDropdownEnter(item.hasDropdown)}
                onMouseLeave={handleDropdownLeave}
              >
                {item.href.startsWith("/") ? (
                  <Link to={item.href} className={linkClass}>
                    <span className="inline-flex items-center gap-1.5 w-fit">
                      <NavIcon className="w-4 h-4 shrink-0 text-primary" aria-hidden />
                      <span>{item.label}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4 shrink-0" />}
                    </span>
                  </Link>
                ) : (
                  <a href={item.href} className={linkClass}>
                    <span className="inline-flex items-center gap-1.5 w-fit">
                      <NavIcon className="w-4 h-4 shrink-0 text-primary" aria-hidden />
                      <span>{item.label}</span>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4 shrink-0" />}
                    </span>
                  </a>
                )}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.hasDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      dir={isAr ? "rtl" : "ltr"}
                      className={`absolute top-full mt-2 bg-popover border border-border rounded-2xl shadow-2xl z-[100] p-6 ${
                        item.hasDropdown && isScrollableDropdown(item.hasDropdown)
                          ? "flex max-h-[min(78vh,32rem)] flex-col"
                          : ""
                      } ${
                        isAr
                          ? "right-0"
                          : item.hasDropdown === "patients"
                            ? "left-1/2 -translate-x-[42%]"
                            : "left-1/2 -translate-x-1/2"
                      }`}
                      style={{
                        width: item.hasDropdown === "patients"
                          ? "min(520px, calc(100vw - 2rem))"
                          : item.hasDropdown === "workwithus"
                            ? "min(360px, calc(100vw - 2rem))"
                            : "min(460px, calc(100vw - 2rem))",
                      }}
                    >
                      <p className="mb-4 shrink-0 text-start font-body text-xs uppercase tracking-[0.2em] text-accent">
                        {item.hasDropdown === "patients" ? t("patientsVisitorsDropdownTitle") : item.label}
                      </p>
                      <div
                        className={`grid ${item.hasDropdown === "patients" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"} gap-2 ${
                          item.hasDropdown && isScrollableDropdown(item.hasDropdown)
                            ? dropdownScrollListClass
                            : ""
                        }`}
                      >
                        {getSubLinks(item.hasDropdown).map((sub) => (
                          sub.href.startsWith("/") ? (
                            <Link
                              key={sub.label}
                              to={sub.href}
                              onClick={(e) => {
                                const currentPath = window.location.pathname + window.location.search;
                                if (currentPath === sub.href) {
                                  e.preventDefault();
                                  window.location.href = sub.href;
                                }
                                setActiveDropdown(null);
                              }}
                              className={dropdownSubLinkClass}
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                <sub.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={dropdownSubTextClass}>{sub.label}</p>
                                <p className={dropdownSubDescClass}>
                                  {sub.href.startsWith("tel:") ? (
                                    <span className={phoneTextClass}>{sub.desc}</span>
                                  ) : (
                                    sub.desc
                                  )}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <a
                              key={sub.label}
                              href={sub.href}
                              className={dropdownSubLinkClass}
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                <sub.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={dropdownSubTextClass}>{sub.label}</p>
                                <p className={dropdownSubDescClass}>
                                  {sub.href.startsWith("tel:") ? (
                                    <span className={phoneTextClass}>{sub.desc}</span>
                                  ) : (
                                    sub.desc
                                  )}
                                </p>
                              </div>
                            </a>
                          )
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
            })}
          </nav>
          <div className="flex items-center gap-1.5 md:gap-4 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-background transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-foreground" />
            </button>
            <Link
              to="/book-appointment"
              onClick={handleBookAppointmentClick}
              className="hidden lg:inline-flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground rounded-full font-body text-sm tracking-wide hover:bg-primary/90 transition-colors duration-300"
            >
              {t("bookAppointment")}
            </Link>
            <Link
              to="/my-medical-reports"
              className="hidden lg:inline-flex items-center justify-center h-9 px-4 rounded-full font-body text-sm tracking-wide border border-border text-foreground hover:bg-background transition-colors duration-300"
            >
              {t("login")}
            </Link>
            <div className="flex md:hidden items-center bg-muted/40 rounded-full border border-border p-0.5">
              <button
                onClick={() => setLang("en")}
                lang="en"
                className={`rounded-full font-body font-semibold tracking-wide transition-all duration-300 !leading-none flex items-center justify-center px-2 h-7 !text-[10px] ${lang === "en"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-background/60"
                  }`}
                aria-label="English"
              >
                EN
              </button>
              <button
                onClick={() => setLang("ar")}
                lang="ar"
                className={`rounded-full font-arabic font-semibold transition-all duration-300 !leading-none flex items-center justify-center px-2 h-7 !text-[10px] ${lang === "ar"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-background/60"
                  }`}
                aria-label="العربية"
              >
                العربية
              </button>
            </div>
            <button
              className="lg:hidden w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-foreground flex-shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-popover border-t border-border overflow-hidden"
            >
              <nav className="flex flex-col py-4 px-6">
                {navItems.map((item) => {
                  const NavIcon = item.icon;
                  return (
                  <div key={item.label} className="border-b border-border/50 last:border-0">
                    <div className="flex items-center justify-between">
                      {item.href.startsWith("/") ? (
                        <Link
                          to={item.href}
                          className="flex-1 flex items-center gap-2.5 text-foreground font-body text-sm tracking-wide py-3 hover:text-accent transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <NavIcon className="w-4 h-4 text-primary shrink-0" aria-hidden />
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="flex-1 flex items-center gap-2.5 text-foreground font-body text-sm tracking-wide py-3 hover:text-accent transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <NavIcon className="w-4 h-4 text-primary shrink-0" aria-hidden />
                          {item.label}
                        </a>
                      )}
                      {item.hasDropdown && (
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === item.hasDropdown ? null : item.hasDropdown)}
                          className="p-3 text-muted-foreground hover:text-primary transition-colors"
                          aria-label={mobileExpanded === item.hasDropdown ? "Collapse" : "Expand"}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileExpanded === item.hasDropdown ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    <AnimatePresence>
                      {item.hasDropdown && mobileExpanded === item.hasDropdown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="mb-2 overflow-hidden rounded-xl bg-muted/20"
                        >
                          <div
                            dir={isAr ? "rtl" : "ltr"}
                            className={`flex flex-col gap-1 px-4 py-2 ${
                              item.hasDropdown && isScrollableDropdown(item.hasDropdown)
                                ? "max-h-[min(58vh,20rem)] overflow-y-auto overscroll-y-contain pb-4 scroll-pb-4"
                                : ""
                            }`}
                          >
                            {getSubLinks(item.hasDropdown).map((sub) => (
                              sub.href.startsWith("/") ? (
                                <Link
                                  key={sub.label}
                                  to={sub.href}
                                  onClick={(e) => {
                                    const currentPath = window.location.pathname + window.location.search;
                                    if (currentPath === sub.href) {
                                      e.preventDefault();
                                      window.location.href = sub.href;
                                    }
                                    setMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-background transition-colors group w-full"
                                >
                                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <sub.icon className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  <span className="font-body text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors text-start flex-1 min-w-0">
                                    {sub.label}
                                  </span>
                                </Link>
                              ) : (
                                <a
                                  key={sub.label}
                                  href={sub.href}
                                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-background transition-colors group w-full"
                                  onClick={() => setMenuOpen(false)}
                                >
                                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <sub.icon className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  <span className="font-body text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors text-start flex-1 min-w-0">
                                    {sub.label}
                                  </span>
                                </a>
                              )
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        <div className="lg:hidden border-t border-border bg-popover shadow-sm">
          <div className="flex w-full divide-x divide-border rtl:divide-x-reverse">
            <Link
              to="/book-appointment"
              onClick={handleBookAppointmentClick}
              className="flex-1 py-3.5 flex items-center justify-center gap-2 font-body text-sm font-bold text-[#816107] hover:bg-muted/20 transition-colors tracking-wide"
            >
              <Stethoscope className="w-4 h-4 text-[#816107]" />
              <span>{t("bookAppointment")}</span>
            </Link>
            <Link
              to="/my-medical-reports"
              className="flex-1 py-3.5 flex items-center justify-center gap-2 font-body text-sm font-bold text-foreground hover:bg-muted/20 transition-colors tracking-wide"
            >
              <ClipboardList className="w-4 h-4 text-primary" />
              <span>{t("login")}</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;

