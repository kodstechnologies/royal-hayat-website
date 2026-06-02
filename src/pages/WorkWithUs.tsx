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
import { getAllJobs, type JobPosting } from "@/api/job";
import { localizeJobPosting, type LocalizedJob } from "@/lib/jobLocale";
import { getAllWorkCulture, type WorkCultureItem } from "@/api/workCulture";
import {
  getAllEmployeeRecognitions,
  achievementsTextToLines,
  type EmployeeRecognition,
} from "@/api/employeeRecognition";
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
import { Skeleton } from "@/components/ui/skeleton";

type WorkWithUsProps = {
  staffActivitiesImages?: string[];
  galaDinnerImages?: string[];
  hospitalityWeekImages?: string[];
  rhhQuizImages?: string[];
};

type Employee = {
  id: string;
  name: string;
  nameAr: string;
  dept: string;
  deptAr: string;
  role: string;
  roleAr: string;
  image: string;
  achievements: string[];
  achievementsAr: string[];
};

type GalleryCarousel = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  images: string[];
  variant?: "muted";
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

const mapRecognitionToEmployee = (item: EmployeeRecognition): Employee => {
  const lines = achievementsTextToLines(item.achievements ?? "");
  const achievements = lines.length > 0 ? lines : [item.achievements].filter(Boolean);
  const linesAr = achievementsTextToLines(item.arabicAchievements ?? "");
  const achievementsAr =
    linesAr.length > 0
      ? linesAr
      : [item.arabicAchievements || item.achievements].filter(Boolean);
  return {
    id: item._id ?? item.employeeId ?? item.employeeID ?? item.employeeName,
    name: item.employeeName,
    nameAr: item.employeeNameArabic || item.employeeName,
    dept: item.department ?? "",
    deptAr: item.arabicDepartment ?? item.department ?? "",
    role: item.title,
    roleAr: item.arabicTitle || item.title,
    image: item.image ?? "",
    achievements,
    achievementsAr,
  };
};

const mapContentToCarousel = (
  item: WorkCultureItem,
  variant?: "muted",
): GalleryCarousel => ({
  id: item._id ?? item.heading,
  titleEn: item.heading,
  titleAr: item.headingArabic,
  subtitleEn: item.description,
  subtitleAr: item.descriptionArabic,
  images: item.images ?? [],
  variant,
});

const normalizeHeading = (heading: string) => heading.trim().toLowerCase();

const EXPIRY_DATE_KEYS = [
  "expiryDate",
  "expirationDate",
  "expiresAt",
  "expiresOn",
  "deadline",
  "applicationDeadline",
  "closingDate",
  "lastDateToApply",
  "validTill",
  "validUntil",
  "endDate",
] as const;

const parseDateValue = (value: unknown): Date | null => {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const isJobNotExpired = (job: JobPosting) => {
  const record = job as Record<string, unknown>;
  const expiryRaw = EXPIRY_DATE_KEYS.map((key) => record[key]).find(
    (value) => value !== undefined && value !== null && String(value).trim() !== "",
  );

  // If backend doesn't provide an expiry field, keep showing the job.
  if (expiryRaw === undefined) return true;

  const expiryDate = parseDateValue(expiryRaw);
  if (!expiryDate) return true;

  return endOfDay(expiryDate).getTime() >= Date.now();
};

const buildExistingWorkCultureCarousels = (
  staffActivitiesImages: string[],
  galaDinnerImages: string[],
  hospitalityWeekImages: string[],
  rhhQuizImages: string[],
): GalleryCarousel[] => [
  {
    id: "staff-activities",
    titleEn: "Staff Activities — Volley Ball Tournament",
    titleAr: "أنشطة الموظفين — بطولة الكرة الطائرة",
    subtitleEn:
      "Achievements are acknowledged—because effort, excellence, and ethical conduct matter.",
    subtitleAr:
      "يُعترف بالإنجازات — لأن الجهد والتميّز والسلوك الأخلاقي أمور تهم.",
    images: staffActivitiesImages,
  },
  {
    id: "gala-dinner",
    titleEn: "Gala Dinner",
    titleAr: "حفل العشاء السنوي",
    subtitleEn: "A night of elegance, gratitude and celebration.",
    subtitleAr: "ليلة من الأناقة، الامتنان والاحتفال.",
    images: galaDinnerImages,
    variant: "muted",
  },
  {
    id: "hospitality-week",
    titleEn: "Hospitality Week",
    titleAr: "أسبوع الضيافة",
    subtitleEn:
      "A week devoted to the hospitality spirit that defines Royale Hayat.",
    subtitleAr: "أسبوع مكرّس لروح الضيافة التي تميّز رويال حياة.",
    images: hospitalityWeekImages,
  },
  {
    id: "rhh-quiz",
    titleEn: "RHH Quiz",
    titleAr: "مسابقة RHH",
    subtitleEn: "Fun, friendly competition across teams.",
    subtitleAr: "مرح ومنافسة ودي بين الفرق.",
    images: rhhQuizImages,
    variant: "muted",
  },
];

const mergeApiWorkCulture = (
  apiItems: WorkCultureItem[],
  existing: GalleryCarousel[],
): GalleryCarousel[] => {
  const existingHeadings = new Set(
    existing.flatMap((carousel) => [
      normalizeHeading(carousel.titleEn),
      normalizeHeading(carousel.titleAr),
    ]),
  );

  return apiItems
    .map((item, index) =>
      mapContentToCarousel(item, index % 2 === 1 ? "muted" : undefined),
    )
    .filter(
      (carousel) =>
        !existingHeadings.has(normalizeHeading(carousel.titleEn)) &&
        !existingHeadings.has(normalizeHeading(carousel.titleAr)),
    )
    .map((carousel) => ({ ...carousel, id: `api-${carousel.id}` }));
};

const WorkWithUs = ({
  staffActivitiesImages = [],
  galaDinnerImages = [],
  hospitalityWeekImages = [],
  rhhQuizImages = [],
}: WorkWithUsProps) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [activeCategory, setActiveCategory] = useState("View All");
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(false);
  const [apiEmployees, setApiEmployees] = useState<Employee[]>([]);
  const [employeesApiLoading, setEmployeesApiLoading] = useState(true);

  const displayEmployees = useMemo(() => apiEmployees, [apiEmployees]);
  const [apiWorkCultureCarousels, setApiWorkCultureCarousels] = useState<
    GalleryCarousel[]
  >([]);
  const [workCultureApiLoading, setWorkCultureApiLoading] = useState(true);

  const existingWorkCultureCarousels = useMemo(
    () =>
      buildExistingWorkCultureCarousels(
        staffActivitiesImages,
        galaDinnerImages,
        hospitalityWeekImages,
        rhhQuizImages,
      ),
    [
      staffActivitiesImages,
      galaDinnerImages,
      hospitalityWeekImages,
      rhhQuizImages,
    ],
  );
  const [empIndex, setEmpIndex] = useState(0);
  const [isEmpPaused, setIsEmpPaused] = useState(false);

  useEffect(() => {
    if (isEmpPaused || displayEmployees.length <= 1) return;
    const timer = setInterval(() => {
      setEmpIndex((prev) => (prev + 1) % displayEmployees.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isEmpPaused, displayEmployees.length]);

  useEffect(() => {
    if (empIndex >= displayEmployees.length) {
      setEmpIndex(0);
    }
  }, [displayEmployees.length, empIndex]);

  useEffect(() => {
    let cancelled = false;

    const loadCultureContent = async () => {
      setWorkCultureApiLoading(true);
      setEmployeesApiLoading(true);
      try {
        const [workCulture, recognitions] = await Promise.all([
          getAllWorkCulture(),
          getAllEmployeeRecognitions(),
        ]);
        if (cancelled) return;

        setApiWorkCultureCarousels(
          mergeApiWorkCulture(workCulture, existingWorkCultureCarousels),
        );

        setApiEmployees(
          recognitions
            .filter((item) => item.visibilityStatus !== "hide")
            .map(mapRecognitionToEmployee),
        );
      } catch {
        if (!cancelled) {
          setApiWorkCultureCarousels([]);
          setApiEmployees([]);
        }
      } finally {
        if (!cancelled) {
          setWorkCultureApiLoading(false);
          setEmployeesApiLoading(false);
        }
      }
    };

    void loadCultureContent();
    return () => {
      cancelled = true;
    };
  }, [existingWorkCultureCarousels]);
  const categoriesScrollRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const showAll = !section;
  const showSection = (s: string) => showAll || section === s;

  useEffect(() => {
    let cancelled = false;
    const loadJobs = async () => {
      setJobsLoading(true);
      setJobsError(false);
      try {
        const jobs = await getAllJobs({ limit: 100, isActive: true });
        if (cancelled) return;
        setJobPostings(
          jobs.filter((job) => job.isActive !== false && isJobNotExpired(job)),
        );
      } catch {
        if (!cancelled) {
          setJobsError(true);
          setJobPostings([]);
        }
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    };

    void loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);
  const scrollCategories = (direction: "left" | "right") => {
    if (!categoriesScrollRef.current) return;
    const amount = direction === "left" ? -280 : 280;
    categoriesScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const positions = useMemo(
    () =>
      jobPostings
        .map((job, index) => localizeJobPosting(job, isAr, index))
        .filter((job): job is LocalizedJob => job !== null),
    [jobPostings, isAr],
  );

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

  /* --- Work Culture / People Promise from the uploaded document --- */
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
    // {
    //   icon: HandHeart,
    //   title: isAr ? "وعدنا للناس" : "Our People Promise",
    //   desc: isAr
    //     ? "يبدأ وعدنا للمرضى بوعدنا لفريقنا. مكان عمل يُحترم فيه الموظفون ويُوثَق بهم ويُدعمون."
    //     : "Our promise to patients begins with our promise to our people — a workplace where employees are respected, trusted, and supported.",
    // },
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
    ? "culture-narrative space-y-5 font-body text-foreground leading-relaxed text-justify [text-align-last:right]"
    : "culture-narrative space-y-5 font-body text-foreground leading-relaxed text-justify hyphens-auto [text-align-last:left] [&_p]:hyphens-auto";

  return (
    <div
      id="work-culture-page"
      className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107] [&_p]:text-justify [&_li]:text-justify"
    >
      <Header />

      {/* Hero */}
      {showSection("culture") && (
        <section className="py-0 bg-primary/5 overflow-x-clip">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-0 items-stretch lg:items-start">
            {/* LEFT — height follows image (no extra space below) */}
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

            {/* RIGHT — content */}
            <ScrollAnimationWrapper className="flex w-full flex-col justify-center px-8 py-10 md:px-14 md:py-12 lg:px-16 lg:self-center lg:py-12 2xl:py-16">
              <div
                dir={isAr ? "rtl" : "ltr"}
                lang={isAr ? "ar" : "en"}
                className={isAr ? "text-right" : "text-left"}
              >
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6 leading-tight">
                {isAr
                  ? "الحياة في مستشفى رويال حياة"
                  : "Life at Royale Hayat Hospital"}
              </h1>
              <div className="space-y-4 font-body text-sm text-foreground leading-relaxed text-justify">
                <p>
                  {isAr
                    ? "في مستشفى رويال حياة، نؤمن بفكرة بسيطة: قد ينسى الناس ما قلناه، لكنهم لن ينسوا أبداً كيف جعلناهم يشعرون كمرضى، أو أفراد عائلة، أو زملاء."
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

      {/* Our People Promise — narrative from document */}
      {showSection("culture") && (
        <section className="py-14 bg-background">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground text-center mb-3 hyphens-auto break-words text-pretty px-1">
                {isAr ? "وعدنا لموظفينا" : "‘Our People Promise’"}
              </h2>
              <p className="text-center !text-center text-accent font-body text-sm mb-8 italic hyphens-auto break-words text-pretty px-1">
                {isAr
                  ? "إن وعدنا لمرضانا يبدأ أولًا من وعدنا لموظفينا."
                  : "Our promise to patients begins with our promise to our people"}
              </p>
              <div dir={isAr ? "rtl" : "ltr"} lang={isAr ? "ar" : "en"} className={cultureNarrativeClass}>
                <p>
                  {isAr
                    ? "نعد بتوفير بيئة عمل يشعر فيها كل موظف بالاحترام، الثقة، والدعم، حيث لا تُقاس قيمة الإنسان بالمسمى الوظيفي، بل بما يقدمه من احترافية، نزاهة، وإسهام حقيقي."
                    : "We promise a work\u00ADplace where em\u00ADploy\u00ADees are re\u00ADspect\u00ADed, trust\u00ADed, and sup\u00ADport\u00ADed not de\u00ADfined by ti\u00ADtles, but val\u00ADued for their pro\u00ADfes\u00ADsion\u00ADal\u00ADism, in\u00ADteg\u00ADri\u00ADty, and con\u00ADtri\u00ADbu\u00ADtion."}
                </p>
                <p>
                  {isAr
                    ? "نستثمر بوعي في التطوير والتعلم المستمر، من خلال البرامج التدريبية، والتعرّف على المعايير العالمية، والتعاون بين التخصصات، وتوفير الفرص التي تساعد موظفينا على النمو بثقة وتميّز."
                    : "We in\u00ADvest de\u00ADlib\u00ADer\u00ADate\u00ADly in learn\u00ADing and de\u00ADvel\u00ADop\u00ADment, through con\u00ADtin\u00ADu\u00ADous train\u00ADing, ex\u00ADpo\u00ADsure to in\u00ADter\u00ADna\u00ADtion\u00ADal stan\u00ADdards, col\u00ADlab\u00ADo\u00ADra\u00ADtion across dis\u00ADci\u00ADplines, and op\u00ADpor\u00ADtu\u00ADni\u00ADties to grow with con\u00ADfi\u00ADdence."}
                </p>
                <p>
                  {isAr
                    ? "فنحن نؤمن بأن التميّز يُبنى بالتعلم، ويستمر بالثقة. ووعدنا بسيط: سندعم تطوركم، ونقدّر جهودكم، ونرافقكم في بناء مسيرة مهنية تفتخرون بها."
                    : "We be\u00ADlieve ex\u00ADcel\u00ADlence is built through learn\u00ADing-and sus\u00ADtained through trust. Our prom\u00ADise is sim\u00ADple: we will help you grow, we will rec\u00ADog\u00ADnize your ef\u00ADfort, and we will walk with you as you build a ca\u00ADreer you can be proud of."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

      {/* Where We Belong Together */}
      {showSection("culture") && (
        <section className="py-14 bg-secondary/10">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollAnimationWrapper>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground text-center mb-8 hyphens-auto break-words text-pretty px-1">
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
                    ? "وفي رويال حياة، لا تمر الجهود والإنجازات دون تقدير، لأن الامتنان جزء أساسي من ثقافتنا، والرعاية تستحق أن تُحتفى بها. هنا، العمل ليس مجرد وظيفة، بل مكان تشعر فيه بالتقدير والانتماء."
                    : "Effort and excellence never go unnoticed here—because appreciation matters, and care deserves to be recognized. At Royale Hayat, it’s more than work. It’s a place to belong and be valued."}
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

      {/* Recognition & Appreciation gallery */}
      {showSection("culture") && (
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 !text-center">
                {isAr ? "التكريم والتقدير" : "Life at Royale Hayat"}
              </p>
              {/* <h2 className="text-xl md:text-2xl font-serif text-foreground">
                {isAr ? "موظفو الشهر" : "Employees of the Month"}
              </h2> */}

              <div className="mt-4 space-y-2">
                <h3 className="text-xl md:text-4xl font-serif text-foreground">
                  {isAr ? "أفضل موظفي شهر أبريل" : "Employees of the Month"}{" "}
                </h3>
              </div>
            </div>

            <div
              className="max-w-5xl mx-auto relative"
              onMouseEnter={() => setIsEmpPaused(true)}
              onMouseLeave={() => setIsEmpPaused(false)}
            >
              {displayEmployees.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayEmployees[empIndex]?.id ?? empIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="ios-flicker-fix bg-popover border border-border/50 rounded-2xl overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-96 flex-shrink-0 bg-primary/5 p-6 flex items-center justify-center">
                      {displayEmployees[empIndex]?.image ? (
                        <img
                          src={displayEmployees[empIndex].image}
                          alt={displayEmployees[empIndex].name}
                          className="w-full h-[400px] object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-[400px] rounded-2xl bg-muted flex items-center justify-center">
                          <Award className="w-16 h-16 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 md:p-8">
                      <h3 className="font-serif text-2xl text-foreground mb-1">
                        {isAr
                          ? displayEmployees[empIndex].nameAr
                          : displayEmployees[empIndex].name}
                      </h3>

                      <p className="font-body text-xs text-accent uppercase tracking-wide mb-2">
                        {isAr
                          ? displayEmployees[empIndex].deptAr
                          : displayEmployees[empIndex].dept}
                      </p>

                      <p className="font-body text-sm text-accent mb-5">
                        {isAr
                          ? displayEmployees[empIndex].roleAr
                          : displayEmployees[empIndex].role}
                      </p>

                      <div>
                        <h4 className="font-serif text-base text-foreground mb-3">
                          {isAr ? "الإنجازات" : "Achievements"}
                        </h4>

                        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-body">
                          {(isAr
                            ? displayEmployees[empIndex].achievementsAr
                            : displayEmployees[empIndex].achievements
                          ).map((ach, idx) => (
                            <p key={idx}>{ach}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              )}

              {employeesApiLoading && (
                <p className="text-center font-body text-xs text-muted-foreground mt-4">
                  {isAr ? "جاري تحميل المزيد..." : "Loading more recognitions..."}
                </p>
              )}

              {/* Navigation Arrows */}
              {displayEmployees.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setEmpIndex(
                        (prev) =>
                          (prev - 1 + displayEmployees.length) %
                          displayEmployees.length,
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
                      setEmpIndex(
                        (prev) => (prev + 1) % displayEmployees.length,
                      )
                    }
                    aria-label={isAr ? "التالي" : "Next"}
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-border bg-background/95 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md ltr-icon focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 [webkit-tap-highlight-color:transparent]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* counter */}
              {displayEmployees.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-5">
                  <span className="font-body text-xs text-muted-foreground tracking-widest">
                    {String(empIndex + 1).padStart(2, "0")} /{" "}
                    {String(displayEmployees.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Work culture galleries — existing images + API additions */}
      {showSection("culture") &&
        existingWorkCultureCarousels.map((carousel) => (
          <LifePhotoCarousel
            key={carousel.id}
            variant={carousel.variant}
            title={isAr ? carousel.titleAr : carousel.titleEn}
            subtitle={isAr ? carousel.subtitleAr : carousel.subtitleEn}
            photos={toCarouselPhotos(
              isAr ? carousel.titleAr : carousel.titleEn,
              carousel.images,
            )}
          />
        ))}

      {showSection("culture") && workCultureApiLoading && (
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-6 max-w-5xl space-y-6">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </section>
      )}

      {showSection("culture") &&
        !workCultureApiLoading &&
        apiWorkCultureCarousels.map((carousel) => (
          <LifePhotoCarousel
            key={carousel.id}
            variant={carousel.variant}
            title={isAr ? carousel.titleAr : carousel.titleEn}
            subtitle={isAr ? carousel.subtitleAr : carousel.subtitleEn}
            photos={toCarouselPhotos(
              isAr ? carousel.titleAr : carousel.titleEn,
              carousel.images,
            )}
          />
        ))}

      {/* Voices from Our People (Testimonials) */}
      {showSection("culture") && <VoicesFromOurPeople />}

      {/* Explore Careers heading */}
      {showSection("culture") && (
        <section className="py-12 bg-background text-center">
          <div className="container mx-auto px-6">
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

      {/* Open Positions */}
      {showSection("positions") && (
        <section className="py-16 bg-secondary/10" id="open-positions">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-8">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3 !text-center">
                  {isAr ? "انضم إلى فريقنا" : "Join Our Network!"}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                  {isAr ? "الوظائف الشاغرة" : "Open Positions"}
                </h2>
                <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto mt-3">
                  {isAr
                    ? "اكتشف الفرص المهنية المتاحة وابدأ رحلتك المهنية معنا اليوم، ضمن بيئة عمل تجمع بين التميّز، التطوير، والرعاية الإنسانية الراقية."
                    : "Explore current opportunities and launch your career with us today."}
                </p>
              </div>
            </ScrollAnimationWrapper>

            {jobsLoading ? (
              <div className="max-w-5xl mx-auto space-y-4 py-2">
                <div className="flex gap-2 overflow-hidden">
                  <Skeleton className="h-10 w-28 rounded-full shrink-0" />
                  <Skeleton className="h-10 w-36 rounded-full shrink-0" />
                  <Skeleton className="h-10 w-32 rounded-full shrink-0" />
                </div>
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </div>
            ) : jobsError ? (
              <div className="max-w-2xl mx-auto rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
                <p className="font-serif text-lg text-foreground mb-2">
                  {isAr ? "تعذر تحميل الوظائف" : "Could not load open positions"}
                </p>
                <p className="text-muted-foreground font-body text-sm">
                  {isAr
                    ? "تحقق من الاتصال أو حاول مرة أخرى لاحقًا."
                    : "Check your connection or try again later."}
                </p>
              </div>
            ) : (
              <>
                {/* Category filter tabs */}
                <div className="flex items-center gap-2 mb-8">
                  <button
                    type="button"
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
                        type="button"
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-body tracking-wide border transition-all ${
                          activeCategory === cat
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-popover text-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        {isAr
                          ? (categoryLabelAr[cat] ?? cat)
                          : cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollCategories("right")}
                    aria-label={isAr ? "مرر لليمين" : "Slide right"}
                    className="w-10 h-10 rounded-full border border-border bg-popover flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex-shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

            {/* Job cards */}
            <div className="max-w-5xl mx-auto space-y-5">
              {filtered.map((pos) => (
                  <motion.div
                    key={pos._id}
                    dir={isAr ? "rtl" : "ltr"}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
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
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">
                          {pos.desc}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <Link
                          to={`/job-application?job=${pos._id}`}
                          dir={isAr ? "rtl" : "ltr"}
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
                ))}
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
              </>
            )}
          </div>
        </section>
      )}

      <style>{`
        #work-culture-page .ios-flicker-fix {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform, opacity;
        }

        #work-culture-page .culture-narrative[dir="rtl"] {
          -webkit-hyphens: none;
          hyphens: none;
        }
        #work-culture-page .culture-narrative[dir="ltr"] p {
          -webkit-hyphens: auto;
          hyphens: auto;
          text-wrap: pretty;
          word-break: normal;
          overflow-wrap: normal;
          hyphenate-character: "-";
          word-spacing: normal;
        }
        @media (max-width: 767px) {
          #work-culture-page .culture-narrative[dir="ltr"] p {
            text-align: justify;
            text-justify: inter-word;
            text-align-last: start;
            -webkit-hyphens: auto;
            hyphens: auto;
            word-spacing: normal;
          }
        }
      `}</style>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default WorkWithUs;
