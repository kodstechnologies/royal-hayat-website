import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import WorkCultureHeroImage from "@/components/WorkCultureHeroImage";
import LifePhotoCarousel from "@/components/LifePhotoCarousel.tsx";
import type { LifePhoto } from "@/components/LifePhotoCarousel.tsx";
import VoicesFromOurPeople from "@/components/VoicesFromOurPeople.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Heart,
  Sparkles,
  HandHeart,
  GraduationCap,
  Globe2,
  Award,
  MapPin,
  Clock,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllJobs, type JobPosting } from "@/api/job";
import {
  getAllEmployeeRecognitions,
  getEmployeeImageSrc,
  DEFAULT_EMPLOYEE_IMAGE,
  mapEmployeeRecognitionToDisplay,
  type EmployeeOfMonthDisplay,
  type EmployeeRecognition,
} from "@/api/employeeRecognition";
import {
  getAllWorkCulture,
  mapWorkCultureToDisplay,
  type WorkCultureItem,
  type WorkCultureSectionDisplay,
} from "@/api/workCulture";
const openPositions = [
  {
    title: "Registrar – Plastic Surgeon",
    category: "La Cosmetique Royale",
    location: "On-Site",
    type: "Full-Time",
    desc: "Candidates applying should have minimum Two years of experience as Plastic Surgery Registrar.",
  },
  {
    title: "Floor Coordinator only Female, Bilingual (Arabic & English)",
    category: "Hospitality / Guest Services",
    location: "On-Site",
    type: "Full-Time",
    desc: "Royale Hayat Hospital have devoted considerable effort to applying established strategies for quality improvement thus they created a position of Floor coordinator.",
  },
  {
    title:
      "Birth Registration Assistant (Bilingual – Arabic & English, only local candidate)",
    category: "Quality & Patient Safety",
    location: "On-Site",
    type: "Full-Time",
    desc: "Birth Registration Clerk shall ensure complete documentation of Birth, Death, Sick Leave, Maternity Leave and other patient related records as per MOH guidelines and protocols.",
  },
  {
    title: "Registered Nurse for Home Care Dept",
    category: "Royale Home Health",
    location: "On-Site",
    type: "Full-Time",
    desc: "To ensure the safe provision of nursing services in collaboration with the patient/family and the multidisciplinary health care team.",
  },
  {
    title:
      "Registered Nurse for Labor and Delivery Department – Local (Female with MOH Licence)",
    category: "Nursing Support",
    location: "On-Site",
    type: "Full-Time",
    desc: "Registered Nurse for Labor and Delivery Department - Local (Female with MOH Licence).",
  },
  {
    title: "Anesthesia – Specialist",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Assesses and prepare patients for Anesthesia.",
  },
  {
    title: "Registrar – Internal Medicine",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Active Listening, Critical Thinking, Active Learning, Monitoring, and Quality control Analysis.",
  },
  {
    title: "Registrar – Obstetrician and Gynecologist",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "To attend casualty cases and give emergency treatment, do the necessary admission procedures.",
  },
  {
    title: "Consultant Pediatrician",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Contribution to the daytime weekly attending rota and covering clinic. Clinic will be both by appointment and emergency walk-ins.",
  },
  {
    title:
      "Registered Nurse for Cosmetic Center – Local (Female with MOH License & Laser Exp)",
    category: "Nursing Support",
    location: "On-Site",
    type: "Full-Time",
    desc: "Responsible for the nursing care of patients according to their scope of practice in liaison with Medical Staff and Allied Health Professionals.",
  },
  {
    title: "Consultant Neonatologist",
    category: "Specialist Doctors",
    location: "On-Site",
    type: "Full-Time",
    desc: "Candidates applying should have minimum Five years of experience in SCBU/NICU.",
  },
  {
    title: "Brand Manager",
    category: "Marketing & Communications",
    location: "On-Site",
    type: "Full-Time",
    desc: "The Brand Manager develops and executes strategies to enhance Royale Hayat Hospital's brand image. Responsibilities include managing social media campaigns, supervising team members, coordinating publicity for doctors.",
  },
  {
    title: "Anesthesia Technician – Local (Female with MOH)",
    category: "Surgical Services",
    location: "On-Site",
    type: "Full-Time",
    desc: "Responsible for providing care to patients undergoing anesthesia in liaison with Medical Staff and Allied Health Professionals.",
  },
];
type Position = {
  id: string;
  title: string;
  category: string;
  location: string;
  type: string;
  desc: string;
};
type WorkWithUsProps = {
  staffActivitiesImages: string[];
  galaDinnerImages: string[];
  hospitalityWeekImages: string[];
  rhhQuizImages: string[];
};
const toCarouselPhotos = (label: string, images: string[]): LifePhoto[] => {
  if (images.length === 0) {
    return [{ alt: `${label} — 1` }];
  }
  return images.map((src, index) => ({
    src,
    alt: `${label} — ${index + 1}`,
  }));
};

const buildStaticWorkCultureSections = (
  staffActivitiesImages: string[],
  galaDinnerImages: string[],
  hospitalityWeekImages: string[],
  rhhQuizImages: string[],
): WorkCultureSectionDisplay[] => [
  {
    key: "staff-activities",
    titleEn: "Staff Activities — Volley Ball Tournament",
    titleAr: "أنشطة الموظفين | بطولة الكرة الطائرة",
    subtitleEn:
      "Achievements are acknowledged—because effort, excellence, and ethical conduct matter.",
    subtitleAr:
      "يتم تقدير الإنجازات والاعتراف بها، لأن الجهد والتميّز والسلوك المهني القائم على القيم يشكّلون أساس نجاحنا.",
    images: staffActivitiesImages,
  },
  {
    key: "gala-dinner",
    titleEn: "Gala Dinner",
    titleAr: "حفل العشاء السنوي",
    subtitleEn: "A night of elegance, gratitude and celebration.",
    subtitleAr: "أمسية استثنائية تجمع بين الأناقة، والامتنان، والاحتفال بإنجازات فريقنا.",
    images: galaDinnerImages,
  },
  {
    key: "hospitality-week",
    titleEn: "Hospitality Week",
    titleAr: "أسبوع الضيافة",
    subtitleEn: "A week devoted to the hospitality spirit that defines Royale Hayat.",
    subtitleAr:
      "أسبوع مخصص للاحتفاء بروح الضيافة التي تميّز مستشفى رويال حياة وتعكس هويتنا الإنسانية.",
    images: hospitalityWeekImages,
  },
  {
    key: "rhh-quiz",
    titleEn: "Royale Hayat Hospital Quiz",
    titleAr: "مسابقة رويال حياة",
    subtitleEn: "Fun, friendly competition across teams.",
    subtitleAr: "أجواء من التفاعل، والمتعة، والمنافسة الودية التي تجمع فرق العمل بروح واحدة.",
    images: rhhQuizImages,
  },
];

const staticEmployees = [
  {
    name: "Rangaa Tara Mahawan",
    nameAr: "رانجا تارا مهاوان",
    sectorAr: "قطاع الضيافة",
    dept: "Guest Relation Department",
    deptAr: "قسم علاقات الضيوف",
    role: "Bell Man - Guest Relations",
    roleAr: "موظف استقبال الضيوف – قسم علاقات الضيوف",
    image:
      "/images/ranga-tara.png",
    achievements: [
      "Rangaa has earned this recognition through his exceptional helpfulness and a consistently positive attitude. A dependable team member with an exemplary attendance record, he ensures that our guests’ first impression of Royale Hayat is one of comfort and high-standard hospitality.",
      "Dependable and dedicated team member who works harmoniously with others. He is reliable, always willing to extend his duty when needed, and completes tasks efficiently without complaint. Attentive in the lobby and consistently respectful, he is a valued part of the team.",
    ],
    achievementsAr: [
      "حصل رانجا على هذا التكريم بفضل تعاونه الاستثنائي وروحه الإيجابية الدائمة. ويُعد عضوًا موثوقًا ومتفانيًا في فريق العمل، كما يتمتع بسجل حضور وانضباط مثالي، مما يساهم في منح ضيوف رويال حياة انطباعًا أوليًا يعكس الراحة وأعلى معايير الضيافة.",
      "يتميز بروح التعاون والعمل الجماعي، ويُعرف باعتماديته واستعداده الدائم لتمديد ساعات العمل عند الحاجة، مع إنجاز المهام بكفاءة عالية ودون تذمر. كما يحرص دائمًا على متابعة احتياجات الضيوف في منطقة الاستقبال بأسلوب مهني ومحترم، مما يجعله عنصرًا قيّمًا ضمن الفريق.",
    ],
  },
  {
    name: "Mohammad Niyaz Salam",
    nameAr: "محمد نياز سلام",
    sectorAr: "",
    dept: "Call Center Department",
    deptAr: "قسم خدمة العملاء",
    role: "Guest Services Operator - Call Center",
    roleAr: "موظف خدمات الضيوف – مركز خدمة العملاء",
    image:
      "/images/mohammad-niyaz.png",
    achievements: [
      "Mohammad distinguishes himself through efficiency and a commitment to service excellence. His professional handling of guest inquiries, combined with his reliable attendance and disciplined work ethic, has been essential to the success of our Guest Services team.",
      "Highly reliable and flexible team member who always brings positive energy and support to the workplace. He consistently completes tasks on time and never hesitates to step in when needed, even covering shifts at short notice while maintaining excellent performance.",
    ],
    achievementsAr: [
      "يتميّز محمد بالكفاءة العالية والالتزام بتقديم أفضل مستويات الخدمة. وقد كان لتعامله المهني مع استفسارات الضيوف، إلى جانب انضباطه وسجله المتميز في الحضور، دور أساسي في نجاح فريق خدمات الضيوف.",
      "كما يُعرف بمرونته العالية واعتماديته الكبيرة، حيث يحرص دائمًا على نشر الطاقة الإيجابية وتقديم الدعم لزملائه في بيئة العمل. ويتميز بإنجاز المهام في الوقت المحدد، واستعداده الدائم لتغطية المناوبات عند الحاجة حتى في الإشعارات القصيرة، مع الحفاظ على مستوى أداء متميز باستمرار.",
    ],
  },
];
const mapStaticEmployeeToDisplay = (
  employee: (typeof staticEmployees)[number],
): EmployeeOfMonthDisplay => ({
  key: employee.name,
  name: employee.name,
  nameAr: employee.nameAr,
  sectorAr: employee.sectorAr,
  dept: employee.dept,
  deptAr: employee.deptAr,
  role: employee.role,
  roleAr: employee.roleAr,
  image: getEmployeeImageSrc(employee.image),
  achievements: employee.achievements,
  achievementsAr: employee.achievementsAr,
});
const WorkWithUs = ({
  staffActivitiesImages,
  galaDinnerImages,
  hospitalityWeekImages,
  rhhQuizImages,
}: WorkWithUsProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [activeCategory, setActiveCategory] = useState("View All");
  const [isIOSWebKit, setIsIOSWebKit] = useState(false);
  const [positions, setPositions] = useState<Position[]>(() =>
    openPositions.map((p, index) => ({
      id: String(index),
      title: p.title,
      category: p.category,
      location: p.location,
      type: p.type,
      desc: p.desc,
    })),
  );
  const [empIndex, setEmpIndex] = useState(0);
  const [isEmpPaused, setIsEmpPaused] = useState(false);
  const [apiEmployees, setApiEmployees] = useState<EmployeeRecognition[] | null>(null);
  const [apiEmployeesLoaded, setApiEmployeesLoaded] = useState(false);
  const [apiWorkCulture, setApiWorkCulture] = useState<WorkCultureItem[] | null>(null);
  const [apiWorkCultureLoaded, setApiWorkCultureLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAllEmployeeRecognitions()
      .then((items) => {
        if (!cancelled) setApiEmployees(items);
      })
      .catch((error) => {
        console.error("Failed to load employee recognitions:", error);
        if (!cancelled) setApiEmployees([]);
      })
      .finally(() => {
        if (!cancelled) setApiEmployeesLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    getAllWorkCulture()
      .then((items) => {
        if (!cancelled) setApiWorkCulture(items);
      })
      .catch((error) => {
        console.error("Failed to load work culture sections:", error);
        if (!cancelled) setApiWorkCulture([]);
      })
      .finally(() => {
        if (!cancelled) setApiWorkCultureLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const staticWorkCultureSections = useMemo(
    () =>
      buildStaticWorkCultureSections(
        staffActivitiesImages,
        galaDinnerImages,
        hospitalityWeekImages,
        rhhQuizImages,
      ),
    [staffActivitiesImages, galaDinnerImages, hospitalityWeekImages, rhhQuizImages],
  );

  const displayWorkCultureSections = useMemo(() => {
    if (apiWorkCultureLoaded && apiWorkCulture && apiWorkCulture.length > 0) {
      return apiWorkCulture.map(mapWorkCultureToDisplay);
    }
    return staticWorkCultureSections;
  }, [apiWorkCultureLoaded, apiWorkCulture, staticWorkCultureSections]);

  const displayEmployees = useMemo(() => {
    if (apiEmployeesLoaded && apiEmployees && apiEmployees.length > 0) {
      return apiEmployees.map(mapEmployeeRecognitionToDisplay);
    }
    return staticEmployees.map(mapStaticEmployeeToDisplay);
  }, [apiEmployeesLoaded, apiEmployees]);

  const currentEmployee = displayEmployees[empIndex] ?? displayEmployees[0];

  useEffect(() => {
    if (empIndex >= displayEmployees.length) {
      setEmpIndex(0);
    }
  }, [displayEmployees.length, empIndex]);

  useEffect(() => {
    if (isEmpPaused || displayEmployees.length <= 1) return;
    const timer = setInterval(() => {
      setEmpIndex((prev) => (prev + 1) % displayEmployees.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isEmpPaused, displayEmployees.length]);
  useEffect(() => {
    if (displayEmployees.length <= 1) return;
    const next = getEmployeeImageSrc(
      displayEmployees[(empIndex + 1) % displayEmployees.length]?.image,
    );
    const img = new Image();
    img.src = next;
  }, [empIndex, displayEmployees]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent || "";
    const platform = window.navigator.platform || "";
    const maxTouchPoints = window.navigator.maxTouchPoints || 0;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (platform === "MacIntel" && maxTouchPoints > 1);
    const isWebKit = /WebKit/i.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/i.test(ua);
    setIsIOSWebKit(isIOSDevice && isWebKit);
  }, []);
  const categoriesScrollRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const showAll = !section;
  const showSection = (s: string) => showAll || section === s;
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [section]);
  useEffect(() => {
    getAllJobs({ isActive: true })
      .then((jobs) => {
        if (!jobs.length) return;
        setPositions(
          jobs.map((job: JobPosting) => ({
            id: String(job._id ?? job.id ?? ""),
            title: job.title,
            category: String(
              job.classification ?? job.category ?? job.department ?? "",
            ),
            location: job.location ?? "",
            type: job.type ?? "",
            desc: job.description ?? job.desc ?? "",
          })),
        );
      })
      .catch(() => {});
  }, []);
  const scrollCategories = (direction: "left" | "right") => {
    if (!categoriesScrollRef.current) return;
    const amount = direction === "left" ? -280 : 280;
    categoriesScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };
  const categories = [
    "View All",
    ...Array.from(new Set(positions.map((p) => p.category))),
  ];
  const categoryLabelAr: Record<string, string> = {
    "View All": "عرض الكل",
    "La Cosmetique Royale": "لا كوزمتيك رويال",
    "Hospitality / Guest Services": "الضيافة وخدمات الضيوف",
    "Quality & Patient Safety": "الجودة وسلامة المرضى",
    "Royale Home Health": "رويال الرعاية الصحية المنزلية",
    "Nursing Support": "دعم التمريض",
    "Specialist Doctors": "الأطباء الاستشاريون والأخصائيون",
    "Marketing & Communications": "التسويق والاتصال المؤسسي",
    "Surgical Services": "الخدمات الجراحية",
  };
  const filtered =
    activeCategory === "View All"
      ? positions
      : positions.filter((p) => p.category === activeCategory);
  const beliefPillars = [
    {
      icon: Heart,
      title: isAr ? "الرحمة قبل الإجراء" : "Compassion Before Procedure",
      desc: isAr
        ? "قد ينسى الناس ما قلناه، لكنهم لن ينسوا أبداً كيف جعلناهم يشعرون. يوجّه هذا الإيمان كيف نرعى ونعمل ونعامل بعضنا البعض."
        : "People may forget what we said, but they will never forget how we made them feel. That belief guides how we care, how we work, and how we treat one another.",
    },
    {
      icon: Sparkles,
      title: isAr
        ? "الاحترافية تلتقي باللطف"
        : "Professionalism Meets Kindness",
      desc: isAr
        ? "تلتقي المعايير بالتعاطف، ويحمل العمل هدفاً. الشفاء ليس فقط بالطب، بل بالتجربة."
        : "Standards meet empathy, and work carries purpose. Healing is not only about medicine, but about experience.",
    },
    {
      icon: GraduationCap,
      title: isAr ? "التعلّم والنمو" : "Learning & Growth",
      desc: isAr
        ? "نستثمر بشكل متعمد في التدريب المستمر، والاطلاع على المعايير الدولية، والتعاون بين التخصصات وفرص النمو بثقة."
        : "We invest deliberately in continuous training, exposure to international standards, cross-disciplinary collaboration, and opportunities to grow with confidence.",
    },
    {
      icon: Globe2,
      title: isAr ? "ننتمي معاً" : "Where We Belong Together",
      desc: isAr
        ? "فريق متنوع متعدد الثقافات تجمعه الكرامة والاحترام والانتماء. ندعم الرفاهية والمرونة والتوازن."
        : "A diverse, multicultural team united by dignity, respect, and belonging. We support wellbeing, resilience, and balance.",
    },
    {
      icon: Award,
      title: isAr ? "التقدير والامتنان" : "Recognition & Appreciation",
      desc: isAr
        ? "لا يمر الجهد والتميّز والسلوك الأخلاقي دون أن يُلاحظ — لأن التقدير مهم، والرعاية تستحق أن تُكرَّم."
        : "Effort, excellence, and ethical conduct never go unnoticed — because appreciation matters, and care deserves to be recognized.",
    },
  ];
  const cultureNarrativeClass = isAr
    ? "culture-narrative space-y-5 font-body tracking-normal text-foreground leading-relaxed text-start"
    : "culture-narrative space-y-5 font-body tracking-normal text-foreground leading-relaxed text-start";
  return (
    <div
      id="work-culture-page"
      className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107] [&_p]:text-start [&_li]:text-start"
    >
      <Header />
      {showSection("culture") && (
        <section className="py-0 bg-primary/5 overflow-x-clip">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-0 items-stretch lg:items-start">
            <div
              dir="ltr"
              className="work-culture-hero-wrap relative w-full min-w-0 bg-background lg:h-auto"
            >
              <WorkCultureHeroImage
                key={lang}
                alt={
                  isAr
                    ? "الحياة في رويال حياة"
                    : "Life at Royale Hayat Hospital"
                }
              />
            </div>
            <ScrollAnimationWrapper className="flex w-full flex-col justify-center px-4 py-10 sm:px-6 md:px-14 md:py-12 lg:px-16 lg:self-center lg:py-12 2xl:py-16">
              <div
                dir={isAr ? "rtl" : "ltr"}
                lang={isAr ? "ar" : "en"}
                className={isAr ? "text-right" : "text-left"}
              >
              <h1 className={`text-4xl md:text-5xl font-serif text-primary mb-6 leading-tight ${isAr ? "!font-bold" : "font-bold"}`}>
                {isAr
                  ? "الحياة في مستشفى رويال حياة"
                  : "Life at Royale Hayat Hospital"}
              </h1>
              <div className="work-body-copy space-y-4 font-body tracking-normal text-[13px] sm:text-sm text-foreground leading-relaxed text-start">
                <p>
                  {isAr
                    ? "في مستشفى رويال حياة، نؤمن بأن الناس قد ينسون ما قلناه، لكنهم لن ينسوا أبدًا كيف جعلناهم يشعرون كمرضى، أو أفراد عائلة، أو زملاء عمل."
                    : "At Royale Hayat Hospital, we hold a simple belief: people may forget what we said, but they will never forget how we made them feel as patients, family members, or colleagues."}
                </p>
                <p>
                  {isAr
                    ? "هذا الإيمان هو ما يوجّه طريقتنا في الرعاية والعمل والتعامل مع الآخرين. ففي كل يوم، يحرص فريقنا على تقديم رعاية آمنة ومتطورة وعالية الجودة، ممزوجة بالرحمة والراحة، لأن الشفاء لا يقتصر على العلاج فقط، بل يشمل التجربة الإنسانية الكاملة."
                    : "That belief guides how we care, how we work, and how we treat one another. Every day, our teams deliver safe, modern, quality care with compassion and comfort—because healing is not only about medicine, but about experience."}
                </p>
                <p>
                  {isAr
                    ? "هنا، تلتقي المهنية باللطف، والمعايير العالية بالتعاطف، والعمل بالرسالة الهادفة. وإذا كانت هذه القيم تشبهك، فأنت بالفعل تنتمي إلى هنا."
                    : "Here, professionalism meets kindness. Standards meet empathy. And work carries purpose. If this belief resonates with you, you already belong here."}
                </p>
              </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}
      {showSection("culture") && (
        <section className="py-14 bg-background">
          <div className="container mx-auto px-3 md:px-6 max-w-none md:max-w-5xl lg:max-w-6xl">
            <ScrollAnimationWrapper>
              <h2 className={`text-2xl md:text-3xl font-serif text-foreground text-center mb-3 text-pretty px-1 ${isAr ? "!font-bold" : "font-bold"}`}>
                {isAr ? "وعدنا لموظفينا" : "‘Our People Promise’"}
              </h2>
              <p className="text-center !text-center text-accent font-body text-sm mb-8 italic text-pretty px-1">
                {isAr
                  ? "إن وعدنا لمرضانا يبدأ أولًا من وعدنا لموظفينا."
                  : "Our promise to patients begins with our promise to our people"}
              </p>
              <div dir={isAr ? "rtl" : "ltr"} lang={isAr ? "ar" : "en"} className={cultureNarrativeClass}>
                <p>
                  {isAr
                    ? "نعد بتوفير بيئة عمل يشعر فيها كل موظف بالاحترام، الثقة، والدعم، حيث لا تُقاس قيمة الإنسان بالمسمى الوظيفي، بل بما يقدمه من احترافية، نزاهة، وإسهام حقيقي."
                    : "We promise a workplace where employees are respected, trusted, and supported, not defined by titles, but valued for their professionalism, integrity, and contribution."}
                </p>
                <p>
                  {isAr
                    ? "نستثمر بوعي في التطوير والتعلم المستمر، من خلال البرامج التدريبية، والتعرّف على المعايير العالمية، والتعاون بين التخصصات، وتوفير الفرص التي تساعد موظفينا على النمو بثقة وتميّز."
                    : "We invest deliberately in learning and development through continuous training, exposure to international standards, collaboration across disciplines, and opportunities to grow with confidence."}
                </p>
                <p>
                  {isAr ? (
                    <>
                      فنحن نؤمن بأن التميّز يُبنى بالتعلم، ويستمر بالثقة. ووعدنا بسيط:
                      <br />
                      سندعم تطوركم، ونقدّر جهودكم، ونرافقكم في بناء مسيرة مهنية تفتخرون بها.
                    </>
                  ) : (
                    "We believe excellence is built through learning—and sustained through trust. Our promise is simple: we will help you grow, we will recognize your effort, and we will walk with you as you build a career you can be proud of."
                  )}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}
      {showSection("culture") && (
        <section className="py-14 bg-secondary/10">
          <div className="container mx-auto px-3 md:px-6 max-w-none md:max-w-5xl lg:max-w-6xl">
            <ScrollAnimationWrapper>
              <h2 className={`text-2xl md:text-3xl font-serif text-foreground text-center mb-8 text-pretty px-1 ${isAr ? "!font-bold" : "font-bold"}`}>
                {isAr ? "معًا… حيث ننتمي" : "‘Where We Belong Together.’"}
              </h2>
              <div dir={isAr ? "rtl" : "ltr"} lang={isAr ? "ar" : "en"} className={cultureNarrativeClass}>
                <p>
                  {isAr
                    ? "العمل في مستشفى رويال حياة يعني أن تكون جزءًا من فريق متنوع الثقافات، يجمعه هدف واحد قائم على الرعاية والإنسانية."
                    : "Working at Royale Hayat means being part of a diverse, multicultural team united by purpose and care."}
                </p>
                <p>
                  {isAr
                    ? "نحن ندرك التحديات النفسية والعاطفية التي ترافق العمل في القطاع الصحي، لذلك نحرص على دعم التوازن، والمرونة، والصحة النفسية لموظفينا. ورغم اختلاف خلفياتنا وثقافاتنا، يجمعنا الاحترام، والكرامة، والشعور الحقيقي بالانتماء."
                    : "We recognize the emotional demands of healthcare and support wellbeing, resilience, and balance. Our people come from many cultures and backgrounds, yet are connected by respect, dignity, and belonging."}
                </p>
                <p>
                  {isAr
                    ? "وفي رويال حياة، لا تمر الجهود والإنجازات دون تقدير، لأن الامتنان جزء أساسي من ثقافتنا، والرعاية تستحق أن تُحتفى بها."
                    : "Effort and excellence never go unnoticed here—because appreciation matters, and care deserves to be recognized. At Royale Hayat, it's more than work. It's a place to belong and be valued"}
                </p>
                {isAr && (
                  <p>
                    هنا، العمل ليس مجرد وظيفة، بل مكان تشعر فيه بالتقدير والانتماء.
                  </p>
                )}
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}
      {showSection("culture") && (
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-3 md:px-6">
            <div className="text-center mb-8">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 !text-center">
                {isAr ? "التكريم والتقدير" : "Life at Royale Hayat"}
              </p>
              <div className="mt-4 space-y-2">
                <h3 className={`text-xl md:text-4xl font-serif text-foreground ${isAr ? "!font-bold" : "font-bold"}`}>
                  {isAr ? "أفضل موظفي شهر أبريل" : "Employees of the Month"}{" "}
                </h3>
              </div>
            </div>
            {currentEmployee && (
            <div
              className="relative max-w-5xl mx-auto"
              onMouseEnter={() => setIsEmpPaused(true)}
              onMouseLeave={() => setIsEmpPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEmployee.key}
                  initial={isIOSWebKit ? false : { opacity: 0, x: isAr ? -30 : 30 }}
                  animate={isIOSWebKit ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={isIOSWebKit ? { opacity: 0 } : { opacity: 0, x: isAr ? 30 : -30 }}
                  transition={{ duration: 0.4 }}
                  className="ios-flicker-fix bg-popover border border-border/50 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-96 flex-shrink-0 bg-primary/5 p-6 flex items-center justify-center">
                      <img
                        src={getEmployeeImageSrc(currentEmployee.image)}
                        alt={isAr ? currentEmployee.nameAr : currentEmployee.name}
                        className="w-full max-h-[420px] object-contain rounded-2xl"
                        loading="eager"
                        decoding="sync"
                        onError={(event) => {
                          const img = event.currentTarget;
                          if (img.dataset.fallbackApplied === "true") return;
                          img.dataset.fallbackApplied = "true";
                          img.src = DEFAULT_EMPLOYEE_IMAGE;
                        }}
                      />
                    </div>
                    <div className="flex-1 p-6 md:p-8">
                      {isAr && currentEmployee.sectorAr && (
                        <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-2">
                          {currentEmployee.sectorAr}
                        </p>
                      )}
                      <h3 className={`font-serif text-2xl text-foreground mb-1 ${isAr ? "!font-bold" : "font-bold"}`}>
                        {isAr ? currentEmployee.nameAr : currentEmployee.name}
                      </h3>
                      <p className="font-body text-xs text-accent uppercase tracking-wide mb-2">
                        {isAr ? currentEmployee.deptAr : currentEmployee.dept}
                      </p>
                      <p
                        className={`font-body text-sm text-accent mb-5 ${isAr ? "" : "justified-body-en"}`}
                        lang={isAr ? "ar" : "en"}
                      >
                        {isAr ? currentEmployee.roleAr : currentEmployee.role}
                      </p>
                      <div>
                        <h4 className="font-serif text-base text-foreground mb-3">
                          {isAr ? "الإنجازات" : "Achievements"}
                        </h4>
                        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-body">
                          {(isAr
                            ? currentEmployee.achievementsAr
                            : currentEmployee.achievements
                          ).map((ach, idx) => (
                            <p key={idx} className={isAr ? "" : "justified-body-en"} lang={isAr ? "ar" : "en"}>
                              {ach}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {displayEmployees.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setEmpIndex(
                        (prev) =>
                          (prev - 1 + displayEmployees.length) % displayEmployees.length,
                      )
                    }
                    aria-label={isAr ? "السابق" : "Previous"}
                    className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 [webkit-tap-highlight-color:transparent]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEmpIndex((prev) => (prev + 1) % displayEmployees.length)
                    }
                    aria-label={isAr ? "التالي" : "Next"}
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 [webkit-tap-highlight-color:transparent]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="font-body text-xs text-muted-foreground tracking-widest">
                  {String(empIndex + 1).padStart(2, "0")} /{" "}
                  {String(displayEmployees.length).padStart(2, "0")}
                </span>
              </div>
            </div>
            )}
          </div>
        </section>
      )}
      {showSection("culture") &&
        displayWorkCultureSections.map((section, index) => {
          const label = isAr ? section.titleAr : section.titleEn;
          return (
            <LifePhotoCarousel
              key={section.key}
              variant={index % 2 === 1 ? "muted" : undefined}
              title={label}
              subtitle={isAr ? section.subtitleAr : section.subtitleEn}
              photos={toCarouselPhotos(label, section.images)}
            />
          );
        })}
      {/* {showSection("culture") && <VoicesFromOurPeople />} */}
      {showSection("culture") && (
        <section className="py-12 bg-background text-center">
          <div className="container mx-auto px-3 md:px-6">
            <Link
              to="/work-with-us?section=positions"
              className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                {isAr
                  ? "انضم إلى فريقنا"
                  : "Explore Careers at Royale Hayat Hospital"}
              </h2>
            </Link>
          </div>
        </section>
      )}
      {showSection("positions") && (
        <section className="py-16 bg-secondary/10" id="open-positions">
          <div className="container mx-auto px-3 md:px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-8">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 !text-center">
                  {isAr ? "انضم إلى فريقنا" : "Join Our Network!"}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                  {isAr ? "الوظائف الشاغرة" : "Open Positions"}
                </h2>
                <p
                  className={`text-muted-foreground font-body text-sm max-w-xl mx-auto mt-3 ${isAr ? "" : "justified-body-en"}`}
                  lang={isAr ? "ar" : "en"}
                >
                  {isAr
                    ? "اكتشف الفرص المهنية المتاحة وابدأ رحلتك المهنية معنا اليوم، ضمن بيئة عمل تجمع بين التميّز، التطوير، والرعاية الإنسانية الراقية."
                    : "Explore current opportunities and launch your career with us today."}
                </p>
              </div>
            </ScrollAnimationWrapper>
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={() => scrollCategories("left")}
                aria-label={isAr ? "مرر لليسار" : "Slide left"}
                className="w-10 h-10 rounded-full border border-border bg-popover flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div
                ref={categoriesScrollRef}
                className="flex items-center gap-2 overflow-x-auto pb-4 -mb-4 scrollbar-hide flex-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-body tracking-wide border transition-all ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-popover text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {isAr ? (categoryLabelAr[cat] ?? cat) : cat.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => scrollCategories("right")}
                aria-label={isAr ? "مرر لليمين" : "Slide right"}
                className="w-10 h-10 rounded-full border border-border bg-popover flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex-shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-5xl mx-auto space-y-5">
              {filtered.map((pos) => {
                const originalIndex = positions.findIndex(
                  (p) => p.id === pos.id,
                );
                return (
                  <motion.div
                    key={pos.title}
                    initial={isIOSWebKit ? false : { opacity: 0, y: 20 }}
                    whileInView={isIOSWebKit ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="ios-flicker-fix bg-popover border border-border/50 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg md:text-xl text-foreground mb-2">
                          {pos.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-block px-3 py-1 bg-secondary/30 text-foreground text-[11px] font-body rounded tracking-wide">
                            {pos.category.toUpperCase()}
                          </span>
                        </div>
                        <p
                          className={`font-body text-sm text-muted-foreground leading-relaxed ${isAr ? "" : "justified-body-en"}`}
                          lang={isAr ? "ar" : "en"}
                        >
                          {pos.desc}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <Link
                          to={
                            pos.id && /^[0-9a-fA-F]{24}$/.test(pos.id)
                              ? `/job-application?jobId=${pos.id}`
                              : `/job-application?job=${originalIndex}`
                          }
                          className="inline-flex items-center gap-1 text-accent font-body text-sm font-semibold hover:underline"
                        >
                          {isAr ? "تقدم الآن" : "Apply Now"}{" "}
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />{" "}
                            {pos.location.toUpperCase()}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />{" "}
                            {pos.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <p className="font-body text-sm text-muted-foreground !text-center">
                {isAr
                  ? "لا ترى الوظيفة المناسبة؟ أرسل سيرتك الذاتية إلى"
                  : "Don't see the right fit? Send your CV to"}{" "}
                <a
                  href="mailto:hr@royalehayat.com"
                  className="text-primary hover:text-accent transition-colors font-semibold"
                >
                  hr@royalehayat.com
                </a>
              </p>
            </div>
          </div>
        </section>
      )}
      <style>{`
        #work-culture-page .ios-flicker-fix {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: opacity;
        }
        #work-culture-page .culture-narrative[dir="rtl"],
        #work-culture-page .work-body-copy[dir="rtl"] {
          -webkit-hyphens: none;
          hyphens: none;
        }
        #work-culture-page .culture-narrative[lang="en"] p,
        #work-culture-page .work-body-copy[lang="en"] p {
          text-align: justify;
          text-justify: inter-word;
          text-align-last: auto;
          -webkit-hyphens: auto;
          hyphens: auto;
          hyphenate-limit-chars: 6 3 3;
          text-wrap: auto;
          word-break: normal;
          overflow-wrap: normal;
          max-width: 100%;
          letter-spacing: normal !important;
          font-kerning: normal;
        }
        #work-culture-page .justified-body-en {
          text-align: justify;
          text-justify: inter-word;
          text-align-last: auto;
          -webkit-hyphens: auto;
          hyphens: auto;
          hyphenate-limit-chars: 6 3 3;
          word-break: normal;
          overflow-wrap: normal;
          letter-spacing: normal !important;
          font-kerning: normal;
        }
        @media (max-width: 767px) {
          #work-culture-page section .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          #work-culture-page .culture-narrative[lang="en"] p,
          #work-culture-page .work-body-copy[lang="en"] p {
            text-align: justify !important;
            text-align-last: auto !important;
            text-justify: inter-word;
            -webkit-hyphens: auto !important;
            hyphens: auto !important;
            hyphenate-limit-chars: 6 3 3;
            word-spacing: normal;
            letter-spacing: normal;
            word-break: normal;
            overflow-wrap: normal;
            white-space: normal;
            text-wrap: auto;
            letter-spacing: normal !important;
            font-kerning: normal;
          }
          #work-culture-page .justified-body-en {
            text-align: justify !important;
            text-align-last: auto !important;
            text-justify: inter-word;
            -webkit-hyphens: auto !important;
            hyphens: auto !important;
            hyphenate-limit-chars: 6 3 3;
          }
        }
      `}</style>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default WorkWithUs;