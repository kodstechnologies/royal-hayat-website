import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getAllCSR,
  descriptionToParagraphs,
  type CSRItem,
} from "@/api/csr";

type CSRInitiative = {
  id: string;
  heading: string;
  headingAr: string;
  paragraphs: string[];
  paragraphsAr: string[];
  images: string[];
};

const mapApiToInitiative = (item: CSRItem): CSRInitiative => ({
  id: item._id ?? item.heading,
  heading: item.heading,
  headingAr: item.headingArabic,
  paragraphs: descriptionToParagraphs(item.description ?? ""),
  paragraphsAr: descriptionToParagraphs(item.descriptionArabic ?? ""),
  images: item.images ?? [],
});

const EXISTING_INITIATIVES: CSRInitiative[] = [
  {
    id: "breast-cancer-hospital",
    heading:
      "Breast Cancer Awareness Lecture - Hospital Session held on 7 October 2025",
    headingAr:
      "محاضرة التوعية بسرطان الثدي – جلسة داخل المستشفى أقيمت في 7 أكتوبر 2025",
    images: ["/images/doctors/image4.png.png"],
    paragraphs: [
      "Within its walls, Royale Hayat Hospital hosted an exclusive Breast Cancer Awareness lecture led by our team of expert consultants. The session emphasized early detection, advanced treatment options, and holistic patient care, including emotional well-being.",
      "This luxurious and informative initiative reflects our dedication to empowering women with knowledge, compassion, and exceptional healthcare standards.",
    ],
    paragraphsAr: [
      "داخل جدرانه، استضاف مستشفى رويال حياة محاضرة حصرية للتوعية بسرطان الثدي بقيادة فريقنا من الاستشاريين الخبراء. ركزت الجلسة على الكشف المبكر، وخيارات العلاج المتقدمة، والرعاية الشاملة للمرضى، بما في ذلك الرفاهية العاطفية.",
      "تعكس هذه المبادرة الفاخرة والمعلوماتية تفانينا في تمكين النساء بالمعرفة والرحمة ومعايير الرعاية الصحية الاستثنائية.",
    ],
  },
  {
    id: "breast-cancer-burgan",
    heading:
      "Breast Cancer Awareness Lecture - Burgan Bank Session held on 16 October 2025",
    headingAr:
      "محاضرة التوعية بسرطان الثدي – بنك برقان أقيمت في 16 أكتوبر 2025",
    images: ["/images/doctors/image.png.png"],
    paragraphs: [
      "As part of its signature community initiatives, Royale Hayat Hospital hosted a distinguished Breast Cancer Awareness lecture at Burgan Bank. Our elite consultants guided attendees through the importance of early detection, self-examination, and proactive health practices, empowering women with knowledge and confidence.",
      "This initiative epitomizes Royale Hayat's dedication to preventive healthcare and elevating public health awareness.",
    ],
    paragraphsAr: [
      "كجزء من مبادراته المجتمعية المميزة، استضاف مستشفى رويال حياة محاضرة متميزة للتوعية بسرطان الثدي في بنك برقان. أرشد مستشارونا النخبة الحضور خلال أهمية الكشف المبكر والفحص الذاتي والممارسات الصحية الاستباقية، مما مكن النساء بالمعرفة والثقة.",
      "تجسد هذه المبادرة تفاني رويال حياة في الرعاية الصحية الوقائية ورفع مستوى الوعي بالصحة العامة.",
    ],
  },
  {
    id: "special-olympics",
    heading:
      "Royale Hayat Hospital participated in the 3rd Special Olympics Kuwait Health Screening Event held on 22 October 2025",
    headingAr:
      "شارك مستشفى رويال حياة في الفعالية الثالثة للفحص الصحي للأولمبياد الخاص الكويتي التي أقيمت في 22 أكتوبر 2025",
    images: ["/images/doctors/image2.png.png"],
    paragraphs: [
      "Royale Hayat Hospital proudly participated in the 3rd Special Olympics Kuwait Health Screening Event through its dedicated medical team led by Dr. Alia Ali Ibrahim, Consultant in Internal and Respiratory Medicine. The initiative provided essential health screenings for 150 athletes with special needs across the State of Kuwait.",
      "This reflects the hospital's continued commitment to community engagement, inclusivity, and promoting access to comprehensive, compassionate healthcare for all—especially athletes of determination.",
    ],
    paragraphsAr: [
      "شارك مستشفى رويال حياة بفخر فريقاً طبياً متخصصاً بقيادة الدكتورة علياء علي إبراهيم، استشارية الأمراض الباطنية والجهاز التنفسي. قدمت المبادرة فحوصات صحية أساسية لـ 150 رياضياً من ذوي الاحتياجات الخاصة في دولة الكويت.",
      "يعكس هذا الالتزام تفاني المستشفى المستمر بالتواصل المجتمعي والشمولية وتعزيز الوصول إلى رعاية صحية شاملة ورحيمة للجميع - وخاصة أبطال العزيمة.",
    ],
  },
  {
    id: "womens-health-conference",
    heading:
      "Royale Hayat Hospital's International Conference on Updates in Women's Health held on 29 November 2025",
    headingAr:
      "المؤتمر الدولي لمستشفى رويال حياة حول مستجدات صحة المرأة الذي أقيم في 29 نوفمبر 2025",
    images: ["/images/doctors/image3.png.png"],
    paragraphs: [
      "Royale Hayat Hospital had the honor of hosting an exclusive, high-level scientific conference on the latest advancements in women's health. Esteemed doctors and consultants from across the globe gathered to exchange insights, showcase best practices, and explore innovative approaches in women's healthcare.",
      "This prestigious event reflects our unwavering commitment to delivering world-class, evidence-based care for women in Kuwait and the region.",
    ],
    paragraphsAr: [
      "تشرف مستشفى رويال حياة باستضافة مؤتمر علمي حصري رفيع المستوى حول أحدث التطورات في صحة المرأة. اجتمع نخبة من الأطباء والاستشاريين من جميع أنحاء العالم لتبادل الرؤى واستعراض أفضل الممارسات واستكشاف الأساليب المبتكرة في رعاية صحة المرأة.",
      "يعكس هذا الحدث المرموق التزامنا الراسخ بتقديم رعاية قائمة على الأدلة وبمعايير عالمية للنساء في الكويت والمنطقة.",
    ],
  },
];

const normalizeHeading = (heading: string) => heading.trim().toLowerCase();

const mergeWithExisting = (apiItems: CSRItem[]): CSRInitiative[] => {
  const existingHeadings = new Set(
    EXISTING_INITIATIVES.flatMap((item) => [
      normalizeHeading(item.heading),
      normalizeHeading(item.headingAr),
    ]),
  );

  const fromApi = apiItems
    .map(mapApiToInitiative)
    .filter(
      (item) =>
        !existingHeadings.has(normalizeHeading(item.heading)) &&
        !existingHeadings.has(normalizeHeading(item.headingAr)),
    );

  return fromApi;
};

const renderInitiative = (
  initiative: CSRInitiative,
  isAr: boolean,
) => {
  const title = isAr ? initiative.headingAr : initiative.heading;
  const paragraphs = isAr ? initiative.paragraphsAr : initiative.paragraphs;
  const primaryImage = initiative.images[0];

  return (
    <ScrollAnimationWrapper key={initiative.id}>
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-border/40 bg-primary/5 px-6 py-10 md:px-8 space-y-6">
        <h3 className="font-serif text-2xl text-foreground text-center">{title}</h3>

        {primaryImage && (
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl aspect-video bg-muted">
            <img
              src={primaryImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {initiative.images.length > 1 && (
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
            {initiative.images.slice(1).map((src, index) => (
              <div
                key={`${initiative.id}-img-${index}`}
                className="rounded-xl overflow-hidden aspect-video bg-muted"
              >
                <img
                  src={src}
                  alt={`${title} — ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${initiative.id}-p-${index}`}
              className="font-body text-base text-muted-foreground leading-relaxed text-justify"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </ScrollAnimationWrapper>
  );
};

const CSR = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === "ar";
  const [apiInitiatives, setApiInitiatives] = useState<CSRInitiative[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadInitiatives = async () => {
      setApiLoading(true);
      try {
        const items = await getAllCSR();
        if (cancelled) return;
        setApiInitiatives(mergeWithExisting(items));
      } catch {
        if (!cancelled) setApiInitiatives([]);
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    };

    void loadInitiatives();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
              {isAr ? "التزامنا" : "Our Commitment"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {isAr ? "الاحتفاء بالحياة" : "Celebrating Life"}
            </h1>
            <p className={`text-muted-foreground font-body text-sm max-w-xl mx-auto text-justify ${isAr ? "rtl-text" : ""}`}>
              {t("csrAboutP1")}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Video Section */}
      <section className="pb-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black"
          >
            <video
              src="https://res.cloudinary.com/dqznbmfja/video/upload/v1776248697/Land_Mark_Opening_Coverage_xrvvgf.mp4"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className="w-full h-full aspect-video object-cover pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <div className="max-w-3xl mx-auto mt-8 space-y-4">
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
              {isAr
                ? "بإلهام من رؤية للشفاء تتجاوز جدران المستشفى، يمزج الصرح بين الفن والطبيعة والتصميم المعاصر في بيان حضري ذو مغزى."
                : "Inspired by a vision of healing that extends beyond hospital walls, the monument blends art, nature, and contemporary design into a meaningful urban statement."}
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
              {isAr
                ? "بشكله الدائري الذي يمثل الاستمرارية وزهرته المتفتحة التي تعكس النمو والحيوية، يقف هذا المعلم كتحية للأمل والعافية والتواصل المجتمعي. أكثر من مجرد هيكل، إنه هدية للكويت - يجمّل أفق المدينة بينما يجسد التزاماً راسخاً بالرحمة والرعاية والتفاؤل للأجيال القادمة."
                : "With its circular form representing continuity and its blooming flower reflecting growth and vitality, the landmark stands as a tribute to hope, wellness, and community connection. More than a structure, it is a gift to Kuwait - beautifying the cityscape while embodying a lasting commitment to compassion, care, and optimism for generations to come."}
            </p>
            <p className="font-serif text-xl text-primary text-center italic mt-6">
              {isAr
                ? "مستشفى رويال حياة ... أكثر من مجرد رعاية، شريك للحياة"
                : "Royale Hayat Hospital ... More than care, A partner for life"}
            </p>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            {EXISTING_INITIATIVES.map((initiative) =>
              renderInitiative(initiative, isAr),
            )}

            {apiLoading && (
              <>
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="max-w-3xl mx-auto h-64 w-full rounded-3xl" />
                <Skeleton className="max-w-3xl mx-auto h-24 w-full" />
              </>
            )}

            {!apiLoading &&
              apiInitiatives.map((initiative) =>
                renderInitiative(initiative, isAr),
              )}
          </div>
        </div>
      </section>

      <style>{`
        .rtl-text {
          direction: rtl;
          text-align: right;
        }
        .rtl-text-center {
          direction: rtl;
          text-align: center;
        }
      `}</style>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CSR;
